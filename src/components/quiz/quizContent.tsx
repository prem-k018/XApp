/* eslint-disable react-hooks/exhaustive-deps */
import {Question, QuizDetail} from '@app/model/contentType/quiz';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {theme} from '@app/constants';
import StorageService from '@app/utils/storageService';
import QuizOptions from './quizOptions';
import CircularProgressBar from '../ui-components/circularProgressBar';
import {answeredQuiz, button} from '@app/constants/constants';
import {useAppContext} from '@app/store/appContext';
import {icons} from '@app/assets/icons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ScreenNames from '@app/constants/screenNames';
import providePoints from '@app/services/openLoyalty/loyaltyPoint';
import PointPopup from '@app/components/Popup/pointPopup';
import {addEventForTracking} from '@app/services/tracking/rpiServices';

type QuizContentProps = {
  quizId: string;
  questions: Question[];
  response: QuizDetail | null;
  onQuizStart: () => void;
  quizStarted: boolean;
  onQuizFinish: () => void;
  quizFinished: boolean;
  onCurrQuestionChange: (questionIndex: number) => void;
  currQuestion: number;
  story?: {
    stopStoryAutoscroll: () => {};
  };
};

const QuizContent = ({
  quizId,
  questions,
  response,
  onQuizStart,
  quizStarted,
  onQuizFinish,
  quizFinished,
  onCurrQuestionChange,
  currQuestion,
  story,
}: QuizContentProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [quizPreviouslyCompleted, setQuizPreviouslyCompleted] =
    useState<boolean>(false);
  const [loadNextQuestion, setLoadNextQuestion] = useState<boolean>(true);
  const [score, setScore] = useState<number>(0);
  const [quizFinishedMessage, setQuizFinishedMessage] = useState<string>('');
  const {appConfigData} = useAppContext();
  const [button1Selected, setButton1Selected] = useState<boolean>(true);
  const [selectedOptions, setSelectedOptions] = useState<any>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPoints, setPopupPoints] = useState(0);

  const closePopup = () => {
    setShowPopup(false);
    setPopupPoints(0);
  };
  useEffect(() => {
    checkQuiz();
  }, []);

  useEffect(() => {
    setLoadNextQuestion(true);
  }, [currQuestion]);

  const displayMode = response?.display_scores;
  const handleNextQuestion = (correct: boolean) => {
    let newScore = score;

    if (correct) {
      newScore++;
    }
    setScore(newScore);

    if (currQuestion + 1 === questions?.length) {
      const ratio = newScore / questions?.length;
      if (ratio >= 0.75) {
        setQuizFinishedMessage(response?.result_range_4 ?? '');
      } else if (ratio >= 0.5) {
        setQuizFinishedMessage(response?.result_range_3 ?? '');
      } else if (ratio >= 0.25) {
        setQuizFinishedMessage(response?.result_range_2 ?? '');
      } else {
        setQuizFinishedMessage(response?.result_range_1 ?? '');
      }

      onQuizFinish();
      saveQuiz();
    } else {
      setLoadNextQuestion(false);
      onCurrQuestionChange(currQuestion + 1);
    }
  };

  function checkQuiz() {
    async function checkQuizPrev() {
      const answered = await StorageService.getData(answeredQuiz);
      if (answered) {
        const answeredObject = JSON.parse(answered);
        if (answeredObject[quizId]) {
          setQuizPreviouslyCompleted(true);
        }
      }
    }
    checkQuizPrev();
  }

  function saveQuiz() {
    async function saveQuizResult() {
      const content = await providePoints(quizId ?? '');

      if (
        'data' in content &&
        content?.data?.publish_providePoints?.data?.LoyaltydPoints > 0
      ) {
        setShowPopup(true);
        setPopupPoints(
          content?.data?.publish_providePoints?.data?.LoyaltydPoints,
        );
      }

      const answered = await StorageService.getData(answeredQuiz);
      let answeredObject: any = answered ? JSON.parse(answered) : {};
      answeredObject[quizId] = true;
      await StorageService.storeData(
        answeredQuiz,
        JSON.stringify(answeredObject),
      );
    }
    saveQuizResult();
  }

  const handleShowAnswer = () => {
    const content_Data = {
      ContentType: ScreenNames.quizAnswer,
      screenType: button,
      button_name: 'view_quiz_answer_button',
    };
    addEventForTracking(content_Data);
    setButton1Selected(true);
    navigation?.navigate(ScreenNames.quizAnswer, {
      questions,
      response,
      selectedOptions,
    });
  };

  const handleSelect = (selectedOption: any) => {
    const updatedSelectedOption = selectedOption.map((opt: any) => ({
      ...opt,
      qIndex: currQuestion,
    }));
    setSelectedOptions((prev: any) => {
      const filterPrev = prev.filter((opt: any) => opt.qIndex !== currQuestion);
      return [...filterPrev, ...updatedSelectedOption];
    });
  };

  const styles = StyleSheet.create({
    quizContent: {
      paddingTop: 20,
    },
    options: {
      alignItems: 'center',
      gap: theme.cardMargin.left,
    },
    title: {
      fontFamily: theme.fonts.HCLTechRoobert.medium,
      color: appConfigData?.primary_text_color,
      fontSize: theme.fontSize.font28,
      textAlign: 'center',
    },
    text: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      color: appConfigData?.primary_text_color,
      fontSize: theme.fontSize.font16,
      textAlign: 'center',
    },
    startButton: {
      marginTop: theme.cardMargin.top,
      width: 297,
      height: 47,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.border.borderRadius,
      backgroundColor: appConfigData?.primary_color,
    },
    startButtonTakeQuizAgain: {
      borderRadius: theme.border.borderRadius,
      backgroundColor: theme.colors.lightGray,
    },
    startButtonText: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      color: appConfigData?.primary_text_color,
      fontSize: theme.fontSize.font16,
    },
    submitButton: {
      width: 297,
      height: 47,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.border.borderRadius,
      opacity: 0.5,
      backgroundColor: appConfigData?.primary_color,
    },
    submitButtonEnabled: {
      opacity: 1,
    },
    submitButtonText: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      color: appConfigData?.primary_text_color,
      fontSize: theme.fontSize.font16,
    },
    submittedText: {
      textAlign: 'center',
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      color: appConfigData?.primary_text_color,
      fontSize: theme.fontSize.font20,
    },
    quizCompletionQuote: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      color: appConfigData?.primary_text_color,
      fontSize: theme.fontSize.font24,
      textAlign: 'center',
    },
    buttonView: {
      marginTop: theme.cardMargin.top,
      gap: theme.cardMargin.top,
    },
    answerView: {
      backgroundColor: 'transparent',
      flexDirection: 'row',
      paddingHorizontal: theme.cardPadding.defaultPadding,
      paddingVertical: 10,
      borderWidth: theme.border.borderWidth,
      borderRadius: theme.border.borderRadius,
      borderColor: appConfigData?.primary_text_color,
      gap: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    answerText: {
      fontFamily: theme.fonts.HCLTechRoobert.bold,
      color: appConfigData?.primary_text_color,
      fontSize: theme.fontSize.font14,
    },
    icon: {
      tintColor: appConfigData?.primary_text_color,
    },
    selectedButtonText: {
      color: appConfigData?.secondary_text_color,
    },
    selectedButton: {
      backgroundColor: appConfigData?.primary_text_color,
    },
    selectedIcon: {
      tintColor: appConfigData?.secondary_text_color,
    },
  });

  return (
    <>
      {!quizStarted && (
        <>
          <View>
            <Text style={styles.title}>{response?.title}</Text>
          </View>

          <Text style={styles.text}>{response?.description}</Text>
          {questions.length === 0 ? (
            <Text style={styles.text}>No Question Available</Text>
          ) : (
            <TouchableOpacity
              style={[
                styles.startButton,
                quizPreviouslyCompleted ? styles.startButtonTakeQuizAgain : {},
              ]}
              onPress={onQuizStart}>
              <Text style={styles.startButtonText}>
                {quizPreviouslyCompleted ? 'Want to Retake?' : 'Start Quiz'}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
      {quizStarted &&
        !quizFinished &&
        questions.length > 0 &&
        loadNextQuestion && (
          <>
            <Text style={styles.title}>{questions[currQuestion].question}</Text>
            <View style={styles.quizContent}>
              <QuizOptions
                questions={questions}
                currQuestion={currQuestion}
                onNextQuestion={correct => handleNextQuestion(correct)}
                story={story}
                onSelect={handleSelect}
              />
            </View>
          </>
        )}
      {quizFinished && (
        <>
          <Text style={styles.title}>{response?.title}</Text>
          <Text style={styles.text}>
            {'You scored ' + score + ' out of ' + questions.length}
          </Text>
          <CircularProgressBar
            diameter={200}
            thickness={10}
            progressPercent={(100 * score) / questions.length}
            color="green"
            centerText={
              displayMode === 'Count'
                ? `${score}/${questions.length}`
                : `${Math.round((score / questions.length) * 100)}%`
            }
          />
          <View style={styles.buttonView}>
            <TouchableOpacity
              activeOpacity={1}
              style={[
                styles.answerView,
                button1Selected && styles.selectedButton,
              ]}
              onPress={handleShowAnswer}>
              <Image
                source={icons.passwordActive}
                style={[styles.icon, button1Selected && styles.selectedIcon]}
              />
              <Text
                style={[
                  styles.answerText,
                  button1Selected && styles.selectedButtonText,
                ]}>
                View Answers
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.quizCompletionQuote}>
            {'"' + quizFinishedMessage + '"'}
          </Text>
          {showPopup && (
            <PointPopup points={popupPoints} onClose={closePopup} />
          )}
        </>
      )}
    </>
  );
};

export default QuizContent;
