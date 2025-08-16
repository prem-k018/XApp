/* eslint-disable react-native/no-inline-styles */
import {Text, View, Image, StyleSheet, Pressable} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import {theme} from '@app/constants';
import {useNavigation} from '@react-navigation/native';
import ScreenNames from '@app/constants/screenNames';
import {images} from '@app/assets/images';
import {icons} from '@app/assets/icons';
import {useTranslation} from 'react-i18next';
import {useAppContext} from '@app/store/appContext';
import { view } from '@app/constants/constants';
import { addEventForTracking } from '@app/services/tracking/rpiServices';

const OnboardingFirstScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {t} = useTranslation();
  const {appConfigData} = useAppContext();
  useEffect(() => {
    const appViewTracking = async () => {
      const data = {ContentType: ScreenNames.onboardingFirstScreen,screenType:view};
      await addEventForTracking(data);
    };
    appViewTracking();
  },[]);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    upperView: {
      flex: 0.5,
    },
    image: {
      height: '100%',
      width: '100%',
    },
    middleView: {
      flex: 0.4,
    },
    text: {
      color: theme.colors.Grayscale,
      marginLeft: 20,
      marginRight: theme.cardMargin.right,
      marginTop: theme.cardMargin.top,
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      fontSize: theme.fontSize.font16,
    },
    content: {
      color: appConfigData?.secondary_text_color,
      fontSize: theme.fontSize.font36,
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      lineHeight: 46,
      marginLeft: 20,
      marginRight: 8,
    },
    lowerView: {
      flex: 0.12,
    },
    button: {
      backgroundColor: theme.colors.lightred,
      height: 67,
      width: 67,
      borderRadius: 33.5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    lowerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginLeft: 20,
      marginRight: theme.cardMargin.right,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.upperView}>
        <Image source={images.onboardingFirstScreen} style={styles.image} />
      </View>
      <View style={styles.middleView}>
        <Text style={styles.text}>{t('onboardingFirstScreen.title')}</Text>
        <Text style={styles.content}>
          {t('onboardingFirstScreen.description')}
        </Text>
      </View>
      <View style={styles.lowerView}>
        <View style={styles.lowerContent}>
          <Image source={icons.carouselIcon} />
          <Pressable
            onPress={() =>
              navigation?.navigate(ScreenNames.onboardingSecondScreen)
            }>
            <View style={styles.button}>
              <Image source={icons.navigationArrow} />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default OnboardingFirstScreen;
