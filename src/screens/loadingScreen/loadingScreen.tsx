import {images} from '@app/assets/images';
import {theme} from '@app/constants';
import {serviceFailedError} from '@app/constants/errorMessage';
import {useAppContext} from '@app/store/appContext';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';

interface LoadingScreenProps {
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isLoading,
  error,
  onRetry,
}) => {
  const {t} = useTranslation();
  const {appConfigData} = useAppContext();

  const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: appConfigData?.background_color,
      gap: 14,
    },
    text: {
      fontSize: theme.fontSize.font28,
      fontFamily: theme.fonts.HCLTechRoobert.bold,
      marginTop: 30,
      color: appConfigData?.secondary_text_color,
    },
    errorText: {
      fontSize: theme.fontSize.font16,
      fontFamily: theme.fonts.Inter.regular,
      color: theme.colors.grayScale3,
      width: 320,
      textAlign: 'center',
    },
    button: {
      backgroundColor: theme.colors.fullBlack,
      borderRadius: theme.border.borderRadius,
      justifyContent: 'center',
      alignItems: 'center',
      width: 151,
      height: 47,
    },
    buttonText: {
      fontFamily: theme.fonts.HCLTechRoobert.semiBold,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.primary_text_color,
    },

    loadingIndicatorText: {
      fontSize: theme.fontSize.font16,
      fontFamily: theme.fonts.Inter.regular,
      color: theme.colors.grayScale3,
      textAlign: 'center',
    },
  });

  if (isLoading && error == null) {
    return (
      <View style={[styles.loadingContainer]}>
        <ActivityIndicator size="large" color={appConfigData?.primary_color} />
      </View>
    );
  } else if (error) {
    return (
      <View style={styles.container}>
        <Image source={images.errorImage} />
        <Text style={styles.text}>{t('loadingScreen.oops')}!!</Text>
        <Text style={styles.errorText}>{serviceFailedError}</Text>
        <TouchableOpacity onPress={onRetry}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>
              {t('loadingScreen.retryButton')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  } else {
    return null;
  }
};

export default LoadingScreen;
