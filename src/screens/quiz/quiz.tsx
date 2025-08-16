/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import {StyleSheet, ScrollView, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import LoadingScreen from '../loadingScreen/loadingScreen';
import {Question, QuizDetail} from '@app/model/contentType/quiz';
import {theme} from '@app/constants';
import QuizContent from '@app/components/quiz/quizContent';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import BackButton from '@app/components/ui-components/backButton';
import {
  loadImageForQuizDetailHome,
  loadImageForQuizQuestions,
} from '@app/utils/imageLinkUtils';
import FastImage from 'react-native-fast-image';
import SafeAreaUtils from '@app/utils/safeAreaUtils';
import {GestureDetector} from 'react-native-gesture-handler';
import ConditionalWrapper from '@app/utils/conditionalWrapper';
import {useAppContext} from '@app/store/appContext';
import {sessionTimeout} from '@app/constants/errorCodes';
import {button, view} from '@app/constants/constants';
import {addEventForTracking} from '@app/services/tracking/rpiServices';
import ScreenNames from '@app/constants/screenNames';
import getContentDetail from '@app/services/contentType/contentDetail';
import CardTypes from '@app/components/cards/cardTypes';

export type Props = {
  route: any;
};

const Quiz: React.FC<Props> = ({route}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [response, setResponse] = useState<QuizDetail | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currQuestion, setCurrQuestion] = useState<number>(0);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const safeAreaInsets = SafeAreaUtils.getSafeAreaInsets();
  const safeAreaFrame = SafeAreaUtils.getSafeAreaFrame();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {data, isReel, reel, story} = route.params;
  const {appConfigData} = useAppContext();

  const quizData = data;

  useEffect(() => {
    getData({showLoader: true});
    const appViewTracking = async () => {
      const data = {
        screenType: view,
        content_type: CardTypes.Quiz,
        contentData: quizData,
      };
      await addEventForTracking(data);
    };
    appViewTracking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getData(options: {showLoader: boolean}) {
    const {showLoader} = options;

    try {
      if (showLoader) {
        setIsLoading(true);
        setIsError(null);
      }

      const type = 'Quiz';
      const contents = await getContentDetail(data.Id as any, type);

      if ('data' in contents && contents?.data?.publish_contentDetail) {
        setResponse(contents?.data?.publish_contentDetail);
        setQuestions(contents?.data?.publish_contentDetail?.questions);
        setIsLoading(false); // Hide loading indicator when the service call is complete
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

  let result = {value: '', isColor: false};

  if (!quizStarted || quizFinished) {
    result = loadImageForQuizDetailHome(response?.background_content);
  } else {
    result = loadImageForQuizQuestions(
      questions[currQuestion]?.background_content,
    );
  }

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
      gap: 16,
    },
    totalQuestions: {
      position: 'absolute',
      display: 'flex',
      height: 30,
      width: 'auto',
      backgroundColor: theme.colors.headerButtonBGColor,
      borderRadius: theme.border.borderRadius,
      justifyContent: 'center',
      alignItems: 'center',
      right: theme.cardMargin.right,
      paddingHorizontal: 10,
    },
    totalQuestionsText: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      color: appConfigData?.secondary_text_color,
      fontSize: theme.fontSize.font16,
      textAlign: 'center',
    },
  });

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
            priority: FastImage.priority.high,
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
            <QuizContent
              quizId={data?.Id}
              questions={questions}
              response={response}
              onQuizStart={() => {
                const content_Data = {
                  ContentType: ScreenNames.quiz,
                  screenType: button,
                  button_name: 'quiz_start_button',
                };
                addEventForTracking(content_Data);
                if (story !== undefined) {
                  story.stopStoryAutoscroll();
                }
                setQuizStarted(true);
              }}
              quizStarted={quizStarted}
              onQuizFinish={() => setQuizFinished(true)}
              quizFinished={quizFinished}
              onCurrQuestionChange={(questionIndex: number) =>
                setCurrQuestion(questionIndex)
              }
              currQuestion={currQuestion}
              {...(story !== undefined ? {story: story} : {})}
            />
          </ScrollView>
        </ConditionalWrapper>
        {quizStarted && !quizFinished && questions.length > 0 && (
          <View
            style={[
              styles.totalQuestions,
              {marginTop: safeAreaInsets.top > 0 ? safeAreaInsets.top : 20},
            ]}>
            <Text style={styles.totalQuestionsText}>
              {currQuestion + 1}/{questions.length}
            </Text>
          </View>
        )}
      </View>
      {story === undefined && (
        <BackButton onPress={() => navigation?.goBack()} />
      )}
    </View>
  );
};

export default Quiz;
