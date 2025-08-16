import {Question} from '@app/model/contentType/quiz';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import QuizOption from './option';
import {theme} from '@app/constants';
import {useAppContext} from '@app/store/appContext';
import {loadImageByAddingBaseUrl} from '@app/utils/imageLinkUtils';

type QuizOptionsProps = {
  questions: Question[];
  currQuestion: number;
  onNextQuestion: (correct: boolean) => void;
  story?: {
    stopStoryAutoscroll: () => {};
  };
  onSelect: any;
};

type selectedOption = {
  selected: boolean;
  correct: boolean;
};

const QuizOptions = (props: QuizOptionsProps) => {
  const {questions, currQuestion, onNextQuestion} = props;
  const data = questions[currQuestion].options_compound_fields;
  const [selections, setSelections] = useState<boolean[]>([]);
  const [selected, setSelected] = useState([]);
  const [optionSelected, setOptionSelected] = useState<selectedOption>({
    selected: false,
    correct: false,
  });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [horizontal, setHorizontal] = useState<boolean>(false);
  const {appConfigData} = useAppContext();

  useEffect(() => {
    const newArray: boolean[] = new Array(data.length).fill(false);
    setSelections(newArray);
    setOptionSelected({selected: false, correct: false});
    setSubmitted(false);
    if (
      data.filter(option => option.option_image && option.option_image.url)
        .length > 0
    ) {
      setHorizontal(true);
    }
  }, [data]);

  const handleSelect = (index: number) => {
    if (props.story !== undefined) {
      props.story.stopStoryAutoscroll();
    }
    const newArray = [...selections]; // Create a new array to avoid mutating state directly

    if (questions[currQuestion].question_type === 'Single') {
      const currSelectionState = selections[index];
      // For single-choice questions, only one option can be selected at a time
      newArray.fill(false); // Deselect all options

      if (currSelectionState) {
        setOptionSelected({selected: false, correct: false});
      } else {
        newArray[index] = true; // Select the clicked option
        const selectedOption = data[index];
        setOptionSelected({selected: true, correct: data[index].is_correct});
        setSelected([selectedOption] as any);
      }
    } else if (questions[currQuestion].question_type === 'Multiple') {
      // For multiple-choice questions, toggle the selected state of the clicked option
      newArray[index] = !newArray[index];

      // Determine correctness based on selected options
      const selectedOptions = newArray.reduce(
        (selected, isSelected, i): any =>
          isSelected ? [...selected, data[i]] : selected,
        [],
      );
      const areAllSelectedOptionsCorrect = selectedOptions.every(
        (option: any) => option.is_correct,
      );

      setOptionSelected({
        selected: selectedOptions.length > 0,
        correct: areAllSelectedOptionsCorrect,
      });
      setSelected(selectedOptions);
    }

    setSelections(newArray);
  };

  useEffect(() => {
    props.onSelect(selected);
  }, [selected]);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const callNextQuestion = () => {
    onNextQuestion(optionSelected.correct);
  };

  const styles = StyleSheet.create({
    options: {
      alignItems: 'center',
      gap: theme.cardMargin.left,
    },
    imageView: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: 350,
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.cardMargin.bottom,
    },
    text: {
      color: appConfigData?.primary_text_color,
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
  });

  return (
    <View style={[horizontal ? styles.imageView : styles.options]}>
      {data?.map((option, index) => {
        const optionImage = loadImageByAddingBaseUrl(option.option_image.url);
        return (
          <QuizOption
            selected={selections[index]}
            submitted={submitted}
            correct={option.is_correct}
            title={option.option_text}
            index={index}
            onSelect={handleSelect}
            questionType={questions[currQuestion].question_type}
            key={option.option_id}
            option_image={option.option_image.url ? optionImage : ''}
          />
        );
      })}
      {!submitted && (
        <TouchableOpacity
          style={[
            styles.submitButton,
            optionSelected.selected ? styles.submitButtonEnabled : null,
          ]}
          disabled={!optionSelected.selected}
          onPress={callNextQuestion}>
          <Text style={styles.submitButtonText}>Next</Text>
        </TouchableOpacity>
      )}
      {submitted && currQuestion < questions.length - 1 ? (
        <TouchableOpacity
          style={[styles.submitButton, styles.submitButtonEnabled]}
          onPress={callNextQuestion}>
          <Text style={styles.submitButtonText}>Next Question</Text>
        </TouchableOpacity>
      ) : submitted ? (
        <TouchableOpacity
          style={[styles.submitButton, styles.submitButtonEnabled]}
          onPress={callNextQuestion}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default QuizOptions;