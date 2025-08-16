/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/self-closing-comp */
import {theme} from '@app/constants';
import screensUtils from '@app/utils/screensUtils';
import React, {memo, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {icons} from '@app/assets/icons';
import CardTypes from './cardTypes';
import {loadImageForHomePage} from '@app/utils/imageLinkUtils';
import {useAppContext} from '@app/store/appContext';
import StorageService from '@app/utils/storageService';
import {button, pollResultArray} from '@app/constants/constants';
import savePollData, {
  getPollResultData,
} from '@app/services/contentType/pollService';
import providePoints from '@app/services/openLoyalty/loyaltyPoint';
import {PollResultData} from '@app/model/contentType/pollResult';
import RetailCardDetails from './retailCardDetails';
import ScreenNames from '@app/constants/screenNames';
import {addEventForTracking} from '@app/services/tracking/rpiServices';

const PollCard = ({data}: any) => {
  const [pollResult, setPollResult] = useState<PollResultData | null>(null);
  const [selectedOption, setSelectedOption] = useState<boolean[]>([]);
  const [barFilled, setBarFilled] = useState<boolean>(false);

  // Get the screen width and calculate the container's width and height
  const screenWidth = screensUtils.screenWidth;
  const containerWidth =
    screenWidth - (theme.cardMargin.left + theme.cardMargin.right); // 16 pixels on each side
  const {appConfigData} = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const result = loadImageForHomePage(data);

  useEffect(() => {
    checkPollStatus();
  }, []);

  async function checkPollStatus() {
    const pollTaken = await StorageService.getData(pollResultArray);

    if (pollTaken) {
      const pollTakenObject = await JSON.parse(pollTaken);
      if (pollTakenObject[data.Id]) {
        const storedSelections = pollTakenObject[data.Id];
        if (Array.isArray(storedSelections)) {
          setSelectedOption(storedSelections);
        }

        setBarFilled(true);
        getPollResultResponse(data.document_path);
      }
    }
  }

  const handleSelect = (option: any, index: number) => {
    if (!barFilled) {
      const newSelections = data.options_compound_fields.map(
        (_: any, i: number) => i === index,
      );
      setSelectedOption(newSelections);
    }
  };

  const handleSubmit = () => {
    const content = {
      ContentType: ScreenNames.homeScreen,
      screenType: button,
      button_name: 'poll_submit_button',
    };
    addEventForTracking(content);
    const selectedIndex = selectedOption.findIndex((val: any) => val === true);
    if (selectedIndex === -1) return;
    const pollData = data;

    const newData = {
      title: pollData.Title,
      document_path: pollData.document_path,
      options: pollData.options_compound_fields.map(
        (option: {option_id: any; option_text: any}) => ({
          option_id: option.option_id,
          option_text: option.option_text,
          count: 0,
          percentage: '',
        }),
      ),
      status: true,
      total_vote: 0,
      start_date: '',
      end_date: '',
      created_by: pollData.createdBy,
    };

    const selectedId = data.options_compound_fields[selectedIndex].option_id;
    const selectedOptionIndex = newData?.options?.findIndex(
      (o: any) => o.option_id === selectedId,
    );
    if (selectedOptionIndex !== -1) {
      newData.options[selectedOptionIndex].count++;
    }
    savePollResponse(newData);
  };

  async function savePollResponse(pollData: any) {
    try {
      const contents = await savePollData(pollData);

      if ('data' in contents && contents?.data?.users_saveContent) {
        console.log('Poll Submit Status =>', contents?.data?.users_saveContent);
        updatePollStatusToLocalDB(selectedOption);
        getPollResultResponse(pollData.document_path);

        await providePoints(data.Id ?? '');
      }
    } catch (err: any) {
      console.log(err.message);
    }
  }

  async function updatePollStatusToLocalDB(selectedItems: any) {
    try {
      const pollTaken = await StorageService.getData(pollResultArray);
      if (pollTaken) {
        const pollObject = JSON.parse(pollTaken);
        let pollNewObject = {...pollObject, [data.Id]: selectedItems};
        await StorageService.storeData(
          pollResultArray,
          JSON.stringify(pollNewObject),
        );
      } else {
        await StorageService.storeData(
          pollResultArray,
          JSON.stringify({[data.Id]: selectedItems}),
        );
      }
    } catch (err) {
      console.log('Error storing poll status =>', err);
    }
  }

  async function getPollResultResponse(documentPath: string) {
    try {
      setIsLoading(true);

      const contents = await getPollResultData(documentPath);
      if ('data' in contents && contents?.data?.users_fetchContent) {
        setPollResult(contents?.data?.users_fetchContent);
        console.log('Poll Result Data ==>', contents?.data?.users_fetchContent);
      }
      setBarFilled(true);
      setIsLoading(false);
    } catch (err: any) {
      console.log(err.message);
      setIsLoading(false);
    }
  }

  const ContentTypeItem = ({iconSource, contentType, imageStyle}: any) => (
    <View style={styles.cardType}>
      <View style={styles.cardContainer}>
        {iconSource && (
          <Image source={iconSource} style={[styles.contentIcon, imageStyle]} />
        )}
        <Text style={styles.cardTypeTitle}>{contentType}</Text>
      </View>
    </View>
  );

  const SubmitButton = () => {
    return (
      <TouchableOpacity
        onPress={handleSubmit}
        style={styles.cardInfo}
        activeOpacity={1}>
        <View style={styles.content}>
          <Text style={styles.contentText}>Submit</Text>
          {isLoading ? (
            <ActivityIndicator color={theme.primaryColor} />
          ) : (
            <Image source={icons.backIcon} style={styles.backIcon} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const PollOptions = () => (
    <View style={styles.optionContainer}>
      {data.options_compound_fields.map((option: any, index: number) => (
        <View key={option.option_id}>
          <TouchableOpacity
            disabled={barFilled}
            style={styles.optionView}
            activeOpacity={1}
            onPress={() => handleSelect(option, index)}>
            <View style={styles.outerCircle}>
              {selectedOption[index] && <View style={styles.innerCircle} />}
            </View>
            <Text key={index} style={styles.optionText}>
              {option.option_text}
            </Text>
            {barFilled && (
              <Text style={styles.percentageText}>
                {`${calculatePercentage(option)}%`}
              </Text>
            )}
          </TouchableOpacity>
          <View style={styles.pollBar}>
            <View
              style={[
                styles.filledBar,
                {
                  width: barFilled ? `${calculatePercentage(option)}%` : '0%',
                },
              ]}
            />
          </View>
        </View>
      ))}
      {!barFilled && <SubmitButton />}
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      position: 'relative', // Required for absolute positioning
      overflow: 'hidden', // Prevent image overflow
      marginLeft: theme.cardMargin.left,
      padding: theme.cardPadding.defaultPadding,
      backgroundColor: appConfigData?.background_color,
      borderRadius: theme.border.borderRadius,
    },
    image: {
      width: '100%', // Ensure the image takes up the entire container width
      minHeight: 150, // Ensure the image takes up the entire container height
    },
    gradient: {
      flex: 1,
      position: 'absolute',
      flexDirection: 'column',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      height: '100%',
      width: '100%',
    },
    cardType: {
      position: 'absolute',
      paddingTop: 14,
      flexDirection: 'row',
    },
    cardContainer: {
      gap: 4,
      flexDirection: 'row',
      paddingHorizontal: 8,
      height: 25,
      backgroundColor: '#3A9B7A',
      borderTopRightRadius: theme.border.borderRadius,
      borderBottomRightRadius: theme.border.borderRadius,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flexDirection: 'row',
      paddingHorizontal: 8,
      paddingLeft: 15,
      backgroundColor: appConfigData?.background_color,
      gap: 4,
      height: 35,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.border.borderRadius,
    },
    contentText: {
      fontFamily: theme.fonts.DMSans.semiBold,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
    },
    backIcon: {
      height: 18,
      width: 15,
      transform: [{rotate: '180deg'}],
    },
    cardTypeTitle: {
      paddingTop: screensUtils.isAndroid ? 0 : 1,
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font12,
      color: appConfigData?.primary_text_color,
    },
    contentIcon: {
      height: 18,
      width: 18,
    },
    cardInfo: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      marginTop: 20,
    },
    optionContainer: {
      flex: 1,
      justifyContent: 'center',
      gap: 26,
      marginTop: 69,
      marginHorizontal: 40,
      marginBottom: 42,
    },
    optionView: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    },
    pollBar: {
      height: 4,
      backgroundColor: appConfigData?.background_color,
    },
    filledBar: {
      height: '100%',
      backgroundColor: appConfigData?.primary_color,
    },
    outerCircle: {
      borderWidth: 2,
      borderRadius: 9,
      height: 18,
      width: 18,
      borderColor: appConfigData?.background_color,
      justifyContent: 'center',
      alignItems: 'center',
    },
    innerCircle: {
      height: 10,
      width: 10,
      borderRadius: 5,
      backgroundColor: appConfigData?.background_color,
    },
    optionText: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font12,
      color: appConfigData?.primary_text_color,
    },
    percentageText: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font12,
      color: appConfigData?.primary_text_color,
      position: 'absolute',
      top: 0,
      right: 0,
    },
  });

  const calculatePercentage = (option: any) => {
    const matchingPercentage = pollResult?.options.find(
      p => p.option_id === option.option_id,
    );

    const percentage = matchingPercentage?.percentage
      ? parseInt(matchingPercentage?.percentage ?? 0, 10)
      : 0;

    return percentage;
  };

  return (
    <TouchableOpacity activeOpacity={1}>
      <View style={[styles.container, {width: containerWidth, height: 'auto'}]}>
        {result.isColor ? (
          <View style={[styles.image, {backgroundColor: result.value}]}>
            <ContentTypeItem
              iconSource={icons.pollIcon}
              contentType={CardTypes.Poll}
            />
            <PollOptions />
          </View>
        ) : (
          <FastImage
            style={styles.image}
            source={{
              uri: result.value,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}>
            <LinearGradient
              colors={['#15000000', '#150000']}
              style={styles.gradient}>
              <ContentTypeItem
                iconSource={icons.pollIcon}
                contentType={CardTypes.Poll}
              />
            </LinearGradient>
            <PollOptions />
          </FastImage>
        )}
        <RetailCardDetails data={data} />
      </View>
    </TouchableOpacity>
  );
};

export default memo(PollCard);
