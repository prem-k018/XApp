import {theme} from '@app/constants';
import {useAppContext} from '@app/store/appContext';
import {loadImageByAddingBaseUrl} from '@app/utils/imageLinkUtils';
import React, {useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
} from 'react-native';

type PollOptionProps = {
  selected: boolean;
  submitted: boolean;
  title: string;
  percentage: number;
  option_id: string;
  option_image: string;
  index: number;
  onSelect: (index: number, option_id: string) => void;
};

const PollOption = (props: PollOptionProps) => {
  const fillAnimation = useRef(new Animated.Value(0)).current;
  const {appConfigData} = useAppContext();
  Animated.timing(fillAnimation, {
    toValue: 100,
    duration: 850,
    easing: Easing.cubic,
    useNativeDriver: false,
  }).start();

  const clickItem = () => {
    props.onSelect(props.index, props.option_id);
  };

  const styles = StyleSheet.create({
    option: {
      flexDirection: 'row',
      width: 297,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: 'rgba(255, 255, 255, 0.6)',
      borderWidth: theme.border.borderWidth,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    optionImage: {
      minWidth: 150,
      maxWidth: 151,
      padding: 10,
      borderColor: appConfigData?.primary_text_color,
      borderWidth: theme.border.borderWidth,
      marginHorizontal: theme.cardMargin.right / 2,
      borderRadius: 3,
      marginBottom: theme.cardMargin.bottom,
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
    optionSubmitted: {
      justifyContent: 'flex-end',
    },
    optionSubmittedNotSelected: {
      opacity: 0.6,
    },
    label: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      color: appConfigData?.primary_text_color,
      fontSize: theme.fontSize.font16,
      marginBottom: 6,
    },
    text: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      color: appConfigData?.primary_text_color,
      fontSize: theme.fontSize.font16,
    },
    optionText: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      color: appConfigData?.primary_text_color,
      fontSize: theme.fontSize.font16,
      marginVertical: 15,
    },
    textSelected: {
      color: appConfigData?.secondary_text_color,
    },
    pollBar: {
      position: 'absolute',
      left: 0,
      height: 48,
      backgroundColor: theme.colors.globalGreen,
    },
    pollPercentage: {
      zIndex: 10,
      marginRight: 12,
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      color: appConfigData?.primary_text_color,
      fontSize: theme.fontSize.font16,
    },
  });

  return (
    <View>
      {props.submitted && <Text style={styles.label}>{props.title}</Text>}
      {props.option_image ? (
        <TouchableOpacity
          style={[
            !props.submitted && styles.optionImage,
            props.submitted && [
              styles.option,
              {marginBottom: theme.cardMargin.bottom},
            ],
            props.selected && !props.submitted ? styles.optionSelected : null,
            props.submitted && styles.optionSubmitted,
            props.submitted &&
              !props.selected &&
              styles.optionSubmittedNotSelected,
          ]}
          onPress={clickItem}
          disabled={props.submitted}>
          {props.submitted && (
            <Animated.View
              style={[
                {
                  width: fillAnimation.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', `${props.percentage}%`],
                  }),
                },
                styles.pollBar,
              ]}
            />
          )}
          {!props.submitted && (
            <>
              <Image
                source={{uri: loadImageByAddingBaseUrl(props.option_image)}}
                style={styles.image}
              />
              <Text
                style={[
                  styles.optionText,
                  props.selected ? styles.textSelected : null,
                ]}>
                {props.title}
              </Text>
            </>
          )}
          {props.submitted && (
            <Text style={styles.pollPercentage}>{`${props.percentage}%`}</Text>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            styles.option,
            props.selected && !props.submitted ? styles.optionSelected : null,
            props.submitted && styles.optionSubmitted,
            props.submitted &&
              !props.selected &&
              styles.optionSubmittedNotSelected,
          ]}
          onPress={clickItem}
          disabled={props.submitted}>
          {props.submitted && (
            <Animated.View
              style={[
                {
                  width: fillAnimation.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', `${props.percentage}%`],
                  }),
                },
                styles.pollBar,
              ]}
            />
          )}
          {!props.submitted && (
            <Text
              style={[
                styles.text,
                props.selected ? styles.textSelected : null,
              ]}>
              {props.title}
            </Text>
          )}
          {props.submitted && (
            <Text style={styles.pollPercentage}>{`${props.percentage}%`}</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PollOption;
