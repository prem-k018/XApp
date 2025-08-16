import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';

export type Props = {
  leftButtonText?: string;
  rightButtonText?: string;
  isButtonDisabled?: boolean;
  handleLeftButton?: () => void;
  handleRightButton?: () => void;
  leftButtonLoading?: boolean;
  rightButtonLoading?: boolean;
};

const BackAndContinueButton: React.FC<Props> = ({
  leftButtonText,
  rightButtonText,
  isButtonDisabled,
  handleLeftButton,
  handleRightButton,
  leftButtonLoading,
  rightButtonLoading,
}) => {
  const {appConfigData} = useAppContext();

  const styles = StyleSheet.create({
    buttonView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: theme.cardPadding.mediumSize,
      backgroundColor: appConfigData?.background_color,
      paddingHorizontal: theme.cardMargin.left,
    },
    button: {
      width: '48%',
      borderRadius: theme.border.borderRadius,
      paddingVertical: 15,
    },
    buttonText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.primary_text_color,
      alignSelf: 'center',
    },
  });

  return (
    <View style={styles.buttonView}>
      <TouchableOpacity
        onPress={handleLeftButton}
        activeOpacity={1}
        style={[
          styles.button,
          {
            borderWidth: theme.border.borderWidth,
            borderColor: appConfigData?.secondary_text_color,
          },
        ]}>
        {leftButtonLoading ? (
          <ActivityIndicator color={appConfigData?.secondary_text_color} />
        ) : (
          <Text
            style={[
              styles.buttonText,
              {
                color: appConfigData?.secondary_text_color,
              },
            ]}>
            {leftButtonText}
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleRightButton}
        activeOpacity={1}
        style={[
          styles.button,
          isButtonDisabled
            ? {backgroundColor: appConfigData?.primary_color}
            : {backgroundColor: '#C4C5C4'},
        ]}>
        {rightButtonLoading ? (
          <ActivityIndicator color={appConfigData?.primary_text_color} />
        ) : (
          <Text
            style={[
              styles.buttonText,
              {color: appConfigData?.primary_text_color},
            ]}>
            {rightButtonText}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default BackAndContinueButton;
