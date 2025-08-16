import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import BackButton from '@app/components/ui-components/backButton';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {theme} from '@app/constants';
import {useAppContext} from '@app/store/appContext';
import {
  loadImageByAddingBaseUrl,
  loadImageForQuizDetailHome,
} from '@app/utils/imageLinkUtils';
import FastImage from 'react-native-fast-image';
import {icons} from '@app/assets/icons';
import {view} from '@app/constants/constants';
import ScreenNames from '@app/constants/screenNames';
import {addEventForTracking} from '@app/services/tracking/rpiServices';

const QuizAnswerScreen = ({route}: any) => {
  const [horizontal, setHorizontal] = useState<boolean>(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {appConfigData} = useAppContext();

  useEffect(() => {
    const appViewTracking = async () => {
      const data = {ContentType: ScreenNames.quizAnswer, screenType: view};
      await addEventForTracking(data);
    };
    appViewTracking();
  }, []);

  useEffect(() => {
    if (
      questions.filter(
        (option: any) => option.option_image && option.option_image.url,
      ).length > 0
    ) {
      setHorizontal(true);
    }
  });

  const {questions, response, selectedOptions} = route.params;
  let result = {value: '', isColor: false};

  result = loadImageForQuizDetailHome(response?.background_content);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 26,
      paddingVertical: 80,
      gap: 16,
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
    questionView: {
      gap: 16,
    },
    question: {
      fontFamily: theme.fonts.HCLTechRoobert.medium,
      color: appConfigData?.primary_text_color,
      fontSize: theme.fontSize.font24,
    },
    option: {
      flexDirection: 'row',
      width: '100%',
      height: 50,
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: theme.border.borderWidth,
      borderRadius: theme.border.borderRadius,
      paddingLeft: theme.cardMargin.left,
      paddingRight: theme.cardMargin.right,
      borderColor: 'rgba(255, 255, 255, 0.6)',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      gap: 10,
    },
    text: {
      flex: 1,
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      color: appConfigData?.primary_text_color,
      fontSize: theme.fontSize.font16,
    },
    imageView: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: 350,
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.cardMargin.bottom,
    },
    optionImage: {
      minWidth: 150,
      maxWidth: 151,
      padding: 10,
      borderColor: appConfigData?.primary_text_color,
      borderWidth: theme.border.borderWidth,
      borderRadius: 3,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: '100%',
      height: 114,
      resizeMode: 'cover',
      borderRadius: 3,
    },
    optionImageText: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      color: appConfigData?.primary_text_color,
      fontSize: theme.fontSize.font16,
      marginVertical: theme.cardPadding.defaultPadding,
    },
    correctAnswer: {
      fontFamily: theme.fonts.HCLTechRoobert.medium,
      color: appConfigData?.primary_text_color,
      fontSize: theme.fontSize.font16,
    },
    icon: {
      paddingRight: 12,
    },
  });
  return (
    <>
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
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}>
            {questions.map((question: any, index: number) => {
              const correctOption = question.options_compound_fields.filter(
                (option: any) => option.is_correct,
              );
              const hasEmptyUrl = correctOption.some(
                (option: any) => option.option_image.url === '',
              );
              const questionSelectedOptions = selectedOptions.filter(
                (opt: any) => opt.qIndex === index,
              );
              return (
                <View key={index} style={styles.questionView}>
                  {/* Display the Question  */}

                  <Text style={styles.question}>{question.question}</Text>

                  {/* Display the Selected Options */}

                  {questionSelectedOptions.map((option: any) => {
                    const optionImage = loadImageByAddingBaseUrl(
                      option.option_image.url,
                    );
                    return (
                      <View key={option.option_id}>
                        {option.option_image.url !== '' ? (
                          <View
                            key={option.option_id}
                            style={styles.optionImage}>
                            <Image
                              source={{uri: optionImage}}
                              style={styles.image}
                            />
                            <Text
                              numberOfLines={2}
                              style={styles.optionImageText}>
                              {option.option_text}
                            </Text>
                            {option.is_correct ? (
                              <Image source={icons.right} style={styles.icon} />
                            ) : (
                              <Image source={icons.cross} style={styles.icon} />
                            )}
                          </View>
                        ) : (
                          <View style={styles.option} key={option.option_id}>
                            <Text numberOfLines={2} style={styles.text}>
                              {option.option_text}
                            </Text>
                            {option.is_correct ? (
                              <Image source={icons.right} style={styles.icon} />
                            ) : (
                              <Image source={icons.cross} style={styles.icon} />
                            )}
                          </View>
                        )}
                      </View>
                    );
                  })}

                  {/* Display the Correct Options */}

                  {hasEmptyUrl ? (
                    <Text style={styles.correctAnswer}>
                      Correct Answer:{' '}
                      {correctOption
                        .map((option: any) => option.option_text)
                        .join(', ')}
                    </Text>
                  ) : (
                    <View style={[horizontal ? styles.imageView : {}]}>
                      <Text
                        style={[
                          styles.correctAnswer,
                          {marginBottom: theme.cardMargin.bottom},
                        ]}>
                        Correct Answer:{' '}
                      </Text>
                      {correctOption.map((option: any) => {
                        const optionImage = loadImageByAddingBaseUrl(
                          option.option_image.url,
                        );
                        return (
                          <View
                            key={option.option_id}
                            style={styles.optionImage}>
                            <Image
                              source={{uri: optionImage}}
                              style={styles.image}
                            />
                            <Text style={styles.optionImageText}>
                              {option.option_text}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
        <BackButton onPress={() => navigation?.goBack()} />
      </View>
    </>
  );
};

export default QuizAnswerScreen;
