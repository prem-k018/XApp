/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {theme} from '@app/constants';
import PollOption from './option';
import {
  OptionCompoundFields,
  PollContentDetails,
} from '@app/model/contentType/poll';
import {PollResultResponse} from '@app/model/contentType/pollResult';
import {useAppContext} from '@app/store/appContext';

type PollContentProps = {
  data: OptionCompoundFields[];
  onSubmission: (selectedOption: string, selections: boolean[]) => void;
  pollResponse: PollContentDetails | null;
  selectedItems: boolean[];
  pollResultResponse: PollResultResponse | null;
  submitted: boolean;
  story?: {
    stopStoryAutoscroll: () => {};
  };
};

type selectedOption = {
  selected: boolean;
  correct: boolean;
};

const PollContent = (props: PollContentProps) => {
  const {
    data,
    onSubmission,
    pollResponse,
    pollResultResponse,
    selectedItems,
    submitted,
  } = props;
  const [selections, setSelections] = useState<boolean[]>(selectedItems);
  const [optionSelected, setOptionSelected] = useState<selectedOption>({
    selected: false,
    correct: false,
  });
  const [selectedIndex, setSelectedIndex] = useState<string>('0');
  const [horizontal, setHorizontal] = useState<boolean>(false);
  const {appConfigData} = useAppContext();

  useEffect(() => {
    if (selections.length === 0) {
      const newArray: boolean[] = new Array(data.length).fill(false);
      setSelections(newArray);
    }
    if (
      data.filter(option => option.option_image && option.option_image.url)
        .length > 0
    ) {
      setHorizontal(true);
    }
  }, [data]);

  useEffect(() => {
    console.log('Selection 2: ', selections);
  }, [selections]);

  const handleSelect = (index: number, option_id: string) => {
    if (props.story !== undefined) {
      props.story.stopStoryAutoscroll();
    }
    setSelectedIndex(option_id);

    const currSelectionState = selections[index];
    const newArray: boolean[] = new Array(selections.length).fill(false);
    if (currSelectionState) {
      setOptionSelected({selected: false, correct: false});
    } else {
      newArray[index] = true;
      setOptionSelected({selected: true, correct: false});
    }
    setSelections(newArray);
  };

  const handleSubmit = () => {
    onSubmission(selectedIndex, selections);
  };

  const styles = StyleSheet.create({
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
    pollContent: {
      paddingTop: 20,
    },
    options: {
      alignItems: 'center',
      gap: theme.cardMargin.right,
    },
    imageView: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: 350,
      justifyContent: 'center',
      alignItems: 'center',
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
      margin: theme.cardMargin.left,
      textAlign: 'center',
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      color: appConfigData?.primary_text_color,
      fontSize: theme.fontSize.font20,
    },
  });

  return (
    <>
      {submitted ? (
        <>
          <Text style={styles.title}>{pollResponse?.title}</Text>
          <Text style={styles.text}>{pollResponse?.description}</Text>
        </>
      ) : (
        <>
          <Text style={styles.title}>{pollResponse?.poll_question}</Text>
          <Text style={styles.text}>{pollResponse?.poll_description}</Text>
        </>
      )}
      <View style={styles.pollContent}>
        <View style={[horizontal ? styles.imageView : styles.options]}>
          {data.map((option, index) => {
            // Find the percentage object that matches the option_id
            const matchingPercentage =
              pollResultResponse?.data.users_fetchContent.options.find(
                p => p.option_id === option.option_id,
              );

            // If a matching percentage is found, use it; otherwise, use a default value (e.g., 0)
            const percentage = matchingPercentage?.percentage
              ? parseInt(matchingPercentage?.percentage ?? '0', 10)
              : 0;

            return (
              <PollOption
                selected={selections[index]}
                submitted={submitted}
                title={option.option_text}
                percentage={percentage}
                index={index}
                onSelect={handleSelect}
                key={option.option_id}
                option_id={option.option_id}
                option_image={
                  option.option_image.url ? option.option_image.url : ''
                }
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
              onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          )}
          {submitted && (
            <Text style={styles.submittedText}>Thanks for your response!</Text>
          )}
        </View>
      </View>
    </>
  );
};

export default PollContent;
