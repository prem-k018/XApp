/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/self-closing-comp */
import {StyleSheet, ScrollView, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import LoadingScreen from '../loadingScreen/loadingScreen';
import {theme} from '@app/constants';
import PollContent from '@app/components/poll/pollContent';
import savePollData, {
  getPollResultData,
  getPollScreenData,
} from '@app/services/contentType/pollService';
import {
  OptionCompoundFields,
  PollContentDetails,
} from '@app/model/contentType/poll';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import BackButton from '@app/components/ui-components/backButton';
import {loadImageForPollDetail} from '@app/utils/imageLinkUtils';
import FastImage from 'react-native-fast-image';
import {PollResultResponse} from '@app/model/contentType/pollResult';
import StorageService from '@app/utils/storageService';
import {pollResultArray, view} from '@app/constants/constants';
import {GestureDetector} from 'react-native-gesture-handler';
import SafeAreaUtils from '@app/utils/safeAreaUtils';
import ConditionalWrapper from '@app/utils/conditionalWrapper';
import {sessionTimeout} from '@app/constants/errorCodes';
import providePoints from '@app/services/openLoyalty/loyaltyPoint';
import PointPopup from '@app/components/Popup/pointPopup';
import ScreenNames from '@app/constants/screenNames';
import {addEventForTracking} from '@app/services/tracking/rpiServices';
import getContentDetail from '@app/services/contentType/contentDetail';

export type Props = {
  route: any;
};

const Poll: React.FC<Props> = ({route}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [response, setResponse] = useState<PollContentDetails | null>(null);
  const [pollResult, setPollResult] = useState<PollResultResponse | null>(null);
  const [selectedItems, setSelectedItems] = useState<boolean[]>([]);

  const [optionFields, setOptionFields] = useState<OptionCompoundFields[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [pollSubmitted, setPollSubmitted] = useState<boolean>(false);

  const safeAreaFrame = SafeAreaUtils.getSafeAreaFrame();
  const {data, isReel, reel, story} = route.params;

  const [showPopup, setShowPopup] = useState(false);
  const [popupPoints, setPopupPoints] = useState(0);

  const closePopup = () => {
    setShowPopup(false);
    setPopupPoints(0);
  };

  useEffect(() => {
    getData({showLoader: true});
    const appViewTracking = async () => {
      const data = {ContentType: ScreenNames.poll, screenType: view};
      await addEventForTracking(data);
    };
    appViewTracking();
  }, []);

  async function getData(options: {showLoader: boolean}) {
    const {showLoader} = options;
    let pollAlreadyTaken = false;

    const pollTaken = await StorageService.getData(pollResultArray);

    if (pollTaken) {
      const pollTakenObject = await JSON.parse(pollTaken);
      if (data.Id in pollTakenObject) {
        pollAlreadyTaken = true;
      }
    }

    try {
      if (showLoader) {
        setIsLoading(true);
        setIsError(null);
      }

      const type = 'Poll';
      const contents = await getContentDetail(data.Id as any, type);

      if ('data' in contents && contents?.data?.publish_contentDetail) {
        const newData = contents?.data?.publish_contentDetail;
        setResponse(newData);
        setOptionFields(newData?.options_compound_fields ?? []);

        if (pollAlreadyTaken) {
          setPollSubmitted(true);
          const storeSelectedItems = await StorageService.getData(
            pollResultArray,
          );
          console.log('Store selected Item: ', storeSelectedItems);
          if (storeSelectedItems) {
            getPollResultResponse(newData?.document_path);
            setSelectedItems(JSON.parse(storeSelectedItems)[data.Id]);
          }
        } else {
          setIsLoading(false);
        }
      } else {
        setIsError('Something went wrong!!!!');
      }
    } catch (err: any) {
      console.log(err.message);

      if (err.message !== sessionTimeout) {
        setIsError('Something went wrong!!!!'); // Set the error message
      }
    }
  }

  const handleRetry = () => {
    getData({showLoader: true});
  };

  async function updatePollStatusToLocalDB(selectedItems: any) {
    try {
      const pollTaken = await StorageService.getData(pollResultArray);
      if (pollTaken) {
        const pollObject = JSON.parse(pollTaken);
        const pollNewObject = {...pollObject, [data.Id]: selectedItems};
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

  const handlePollSubmission = async (
    selectedOption: string,
    selectedItems: boolean[],
  ) => {
    setSelectedItems(selectedItems);

    const pollData = response;

    if (pollData) {
      const newData = {
        title: pollData?.title,
        document_path: pollData?.document_path,
        options: pollData?.options_compound_fields.map(
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

      const selectedOptionIndex = newData.options?.findIndex(
        option => option.option_id === selectedOption,
      );

      if (selectedOptionIndex !== -1) {
        newData.options[selectedOptionIndex].count++;
      }
      setIsLoading(true);
      setIsError(null);
      savePollResponse(newData);
      updatePollStatusToLocalDB(selectedItems);
    }
  };

  async function savePollResponse(pollData: any) {
    try {
      const contents = await savePollData(pollData);

      if ('data' in contents && contents?.data?.users_saveContent) {
        console.log(contents?.data?.users_saveContent?.message);
        await getPollResultResponse(pollData?.document_path);

        const content = await providePoints(data.Id ?? '');

        if (
          'data' in content &&
          content.data.publish_providePoints.data.LoyaltydPoints > 0
        ) {
          setShowPopup(true);
          setPopupPoints(
            content.data.publish_providePoints.data.LoyaltydPoints,
          );
        }
      } else {
        setIsError('Something went wrong!!!!');
      }
    } catch (err: any) {
      console.log(err.message);
      if (err.message !== sessionTimeout) {
        setIsError('Something went wrong!!!!'); // Set the error message
      }
    }
  }

  async function getPollResultResponse(documentPath: string) {
    try {
      const result = await getPollResultData(documentPath);
      if ('data' in result && result?.data?.users_fetchContent) {
        setPollResult(result);
      }
      setPollSubmitted(true);
      setIsLoading(false);
    } catch (err: any) {
      console.log(err.message);

      if (err.message !== sessionTimeout) {
        setIsError('Something went wrong!!!!'); // Set the error message
      }
    }
  }

  const result = loadImageForPollDetail(response ?? undefined, pollSubmitted);

  return isLoading ? (
    <View style={styles.container}>
      <ConditionalWrapper
        condition={isReel}
        wrapper={children => (
          <GestureDetector gesture={reel.gesture}>{children}</GestureDetector>
        )}>
        <View style={{flex: 1}}>
          <LoadingScreen
            isLoading={isLoading}
            error={isError}
            onRetry={handleRetry}
          />
          <BackButton onPress={() => navigation?.goBack()} />
        </View>
      </ConditionalWrapper>
    </View>
  ) : (
    <View style={styles.container}>
      {result.isColor ? (
        <View style={[styles.fixed, {backgroundColor: result.value}]}></View>
      ) : (
        <FastImage
          style={styles.fixed}
          source={{
            uri: result.value,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}

      <View style={[styles.fixed, styles.imageShade]}>
        <ConditionalWrapper
          condition={isReel}
          wrapper={children => (
            <GestureDetector gesture={reel.gesture}>{children}</GestureDetector>
          )}>
          <ScrollView
            contentContainerStyle={styles.content}
            bounces={false}
            {...(isReel
              ? {
                  onContentSizeChange: (_, contentHeight) => {
                    // If ScrollView does not need to be scrollable as it's shorter than screen height
                    if (contentHeight <= safeAreaFrame.height) {
                      reel.setDownFlingActive(true);
                      reel.setUpFlingActive(true);
                    } else {
                      reel.setDownFlingActive(true);
                      reel.setUpFlingActive(false);
                    }
                  },
                  onScrollBeginDrag: _event => {
                    reel.setDownFlingActive(false);
                    reel.setUpFlingActive(false);
                  },
                  onMomentumScrollEnd: event => {
                    const contentHeight = event.nativeEvent.contentSize.height;
                    const layoutHeight =
                      event.nativeEvent.layoutMeasurement.height;
                    const contentOffset = event.nativeEvent.contentOffset.y;
                    const onScreenContentEnd = layoutHeight + contentOffset;
                    const NEAR_EDGE_THRESHOLD = 50;
                    //Check if near top
                    if (contentOffset < NEAR_EDGE_THRESHOLD) {
                      console.log('near top');
                      reel.setDownFlingActive(true);
                    }
                    //Check if near bottom
                    if (
                      Math.abs(contentHeight - onScreenContentEnd) <
                      NEAR_EDGE_THRESHOLD
                    ) {
                      console.log('near bottom');
                      reel.setUpFlingActive(true);
                    }
                  },
                }
              : {})}>
            <PollContent
              data={optionFields}
              pollResponse={response}
              pollResultResponse={pollResult}
              onSubmission={handlePollSubmission}
              selectedItems={selectedItems}
              submitted={pollSubmitted}
              {...(story !== undefined ? {story: story} : {})}
            />
          </ScrollView>
        </ConditionalWrapper>
      </View>
      {showPopup && <PointPopup points={popupPoints} onClose={closePopup} />}
      {story === undefined && (
        <BackButton onPress={() => navigation?.goBack()} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixed: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageShade: {
    backgroundColor: theme.colors.pollQuizImageBackground,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 26,
    paddingVertical: 100,
    gap: theme.cardMargin.left,
  },
});

export default Poll;
