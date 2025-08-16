import {icons} from '@app/assets/icons';
import {theme} from '@app/constants';
import {useAppContext} from '@app/store/appContext';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';

type QuizOptionProps = {
  selected: boolean;
  submitted: boolean;
  correct: boolean;
  title: string;
  questionType: string;
  option_image: string;

  //For organization by parent
  index: number;
  onSelect: (index: number) => void;
};

const QuizOption = (props: QuizOptionProps) => {
  const clickItem = () => {
    props.onSelect(props.index);
  };
  const {appConfigData} = useAppContext();

  const styles = StyleSheet.create({
    option: {
      flexDirection: 'row',
      width: 297,
      height: 50,
      justifyContent: 'flex-start',
      alignItems: 'center',
      borderWidth: theme.border.borderWidth,
      borderRadius: theme.border.borderRadius,
      paddingLeft: theme.cardMargin.left,
      paddingRight: theme.cardMargin.right,
      borderColor: 'rgba(255, 255, 255, 0.6)',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
    optionSelected: {
      backgroundColor: theme.colors.primaryWhite,
    },
    optionSubmittedNotSelected: {
      opacity: 0.6,
    },
    optionCorrect: {
      backgroundColor: theme.colors.globalGreen,
    },
    checkboxCorrect: {
      backgroundColor: theme.colors.globalGreen,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxIncorrect: {
      backgroundColor: appConfigData?.primary_color,
      justifyContent: 'center',
      alignItems: 'center',
    },
    optionIncorrect: {
      backgroundColor: appConfigData?.primary_color,
    },
    text: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      color: appConfigData?.primary_text_color,
      fontSize: theme.fontSize.font16,
    },
    optionImageText: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      color: appConfigData?.primary_text_color,
      fontSize: theme.fontSize.font16,
      marginVertical: theme.cardPadding.defaultPadding,
    },
    textSelected: {
      color: appConfigData?.secondary_text_color,
    },
    checkbox: {
      height: 20,
      width: 20,
      borderWidth: 1.7,
      borderRadius: 2,
      borderColor: appConfigData?.primary_text_color,
      marginRight: theme.cardMargin.right,
    },
    checkboxSelected: {
      height: 20,
      width: 20,
      borderWidth: 2,
      borderRadius: 2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.fullBlack,
      marginRight: theme.cardMargin.right,
    },
  });

  return (
    <>
      {props.questionType === 'Single' ? (
        <>
          {!props.option_image && (
            <TouchableOpacity
              style={[
                styles.option,
                props.selected && !props.submitted
                  ? styles.optionSelected
                  : null,
                props.submitted && !props.selected
                  ? styles.optionSubmittedNotSelected
                  : null,
                props.submitted && props.correct ? styles.optionCorrect : null,
                props.submitted && !props.correct
                  ? styles.optionIncorrect
                  : null,
              ]}
              onPress={clickItem}
              disabled={props.submitted}>
              <Text
                numberOfLines={2}
                style={[
                  styles.text,
                  props.selected && !props.submitted
                    ? styles.textSelected
                    : null,
                ]}>
                {props.title}
              </Text>
            </TouchableOpacity>
          )}
          {props.option_image && (
            <TouchableOpacity
              style={[
                styles.optionImage,
                props.selected && !props.submitted
                  ? styles.optionSelected
                  : null,
                props.submitted && !props.selected
                  ? styles.optionSubmittedNotSelected
                  : null,
                props.submitted && props.correct ? styles.optionCorrect : null,
                props.submitted && !props.correct
                  ? styles.optionIncorrect
                  : null,
              ]}
              onPress={clickItem}
              disabled={props.submitted}>
              <Image source={{uri: props.option_image}} style={styles.image} />
              <Text
                numberOfLines={2}
                style={[
                  styles.optionImageText,
                  props.selected && !props.submitted
                    ? styles.textSelected
                    : null,
                ]}>
                {props.title}
              </Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <>
          {!props.option_image && (
            <TouchableOpacity
              style={[
                styles.option,
                props.selected && !props.submitted
                  ? styles.optionSelected
                  : null,
                props.submitted && !props.selected
                  ? styles.optionSubmittedNotSelected
                  : null,
                props.submitted && props.correct ? styles.optionCorrect : null,
                props.submitted && !props.correct
                  ? styles.optionIncorrect
                  : null,
              ]}
              onPress={clickItem}
              disabled={props.submitted}>
              <View
                style={[
                  props.selected && !props.submitted
                    ? styles.checkboxSelected
                    : styles.checkbox,
                  props.submitted && !props.selected
                    ? styles.optionSubmittedNotSelected
                    : null,
                  props.submitted && props.correct
                    ? styles.checkboxCorrect
                    : null,
                  props.submitted && !props.correct
                    ? styles.checkboxIncorrect
                    : null,
                ]}>
                {props.selected ? <Image source={icons.checkMark} /> : null}
              </View>
              <Text
                numberOfLines={2}
                style={[
                  styles.text,
                  props.selected && !props.submitted
                    ? styles.textSelected
                    : null,
                ]}>
                {props.title}
              </Text>
            </TouchableOpacity>
          )}
          {props.option_image && (
            <TouchableOpacity
              style={[
                styles.optionImage,
                props.selected && !props.submitted
                  ? styles.optionSelected
                  : null,
                props.submitted && !props.selected
                  ? styles.optionSubmittedNotSelected
                  : null,
                props.submitted && props.correct ? styles.optionCorrect : null,
                props.submitted && !props.correct
                  ? styles.optionIncorrect
                  : null,
              ]}
              onPress={clickItem}
              disabled={props.submitted}>
              <Image source={{uri: props.option_image}} style={styles.image} />
              <Text
                numberOfLines={2}
                style={[
                  styles.optionImageText,
                  props.selected && !props.submitted
                    ? styles.textSelected
                    : null,
                ]}>
                {props.title}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </>
  );
};

export default QuizOption;