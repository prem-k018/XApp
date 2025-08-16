import {images} from '@app/assets/images';
import {theme} from '@app/constants';
import {workInProgressError} from '@app/constants/errorMessage';
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useAppContext} from '@app/store/appContext';

const ProgressScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {t} = useTranslation();
  const {appConfigData} = useAppContext();

  const styles = StyleSheet.create({
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
  });
  return (
    <View style={styles.container}>
      <Image source={images.WIPImage} />
      <Text style={styles.text}>{t('progressScreen.wip')}</Text>
      <Text style={styles.errorText}>{workInProgressError}</Text>
      <TouchableOpacity onPress={() => navigation?.navigate('Home')}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>
            {t('progressScreen.buttonText')}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ProgressScreen;
