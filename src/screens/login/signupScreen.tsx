/* eslint-disable react-native/no-inline-styles */
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ImageBackground,
  Pressable,
  Dimensions,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import {useState} from 'react';
import {icons} from '@app/assets/icons';
import {useNavigation} from '@react-navigation/native';
import {theme} from '@app/constants';
import {images} from '@app/assets/images';
import {useTranslation} from 'react-i18next';
import {useAppContext} from '@app/store/appContext';
import { addEventForTracking } from '@app/services/tracking/rpiServices';
import ScreenNames from '@app/constants/screenNames';
import { view } from '@app/constants/constants';

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const {t} = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {appConfigData} = useAppContext();
  useEffect(() => {
    const appViewTracking = async () => {
      const data = {ContentType: ScreenNames.signupScreen,screenType:view};
      await addEventForTracking(data);
    };
    appViewTracking();
  },[]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    mainView: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 0.65,
    },
    backgroundImage: {
      height: Dimensions.get('window').height + 50,
      width: Dimensions.get('window').width,
      resizeMode: 'contain',
    },
    login: {
      fontSize: theme.fontSize.font28,
      fontFamily: theme.fonts.HCLTechRoobert.bold,
      lineHeight: 57.6,
      color: appConfigData?.secondary_text_color,
    },
    text: {
      fontSize: theme.fontSize.font16,
      fontFamily: theme.fonts.Inter.regular,
      lineHeight: 24.4,
      color: theme.colors.grayScale3,
      width: 300,
      textAlign: 'center',
      marginBottom: 23,
    },
    textInput: {
      width: 305,
      height: 50,
      alignItems: 'flex-start',
      borderRadius: theme.border.borderRadius,
      borderWidth: theme.border.borderWidth,
      borderColor: theme.colors.grayScale4,
      paddingHorizontal: 20,
      marginBottom: 14,
      backgroundColor: theme.colors.primaryWhite,
      fontFamily: theme.fonts.Inter.regular,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.secondary_text_color,
    },
    placeholder: {
      fontFamily: theme.fonts.Inter.regular,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.secondary_text_color,
      width: 225,
      alignItems: 'flex-start',
    },
    textInputPassword: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingRight: 20,
      paddingLeft: 14,
      backgroundColor: theme.colors.primaryWhite,
    },
    button: {
      width: 305,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.border.borderRadius,
      backgroundColor: theme.colors.fullBlack,
    },
    buttonText: {
      fontSize: theme.fontSize.font16,
      fontFamily: theme.fonts.HCLTechRoobert.semiBold,
      paddingVertical: 12,
      color: appConfigData?.primary_text_color,
    },
    signupView: {
      flexDirection: 'row',
      marginTop: 21,
      justifyContent: 'center',
      alignItems: 'center',
    },
    signup: {
      fontSize: theme.fontSize.font16,
      color: appConfigData?.secondary_text_color,
      fontFamily: theme.fonts.Inter.regular,
    },
    signupText: {
      fontSize: theme.fontSize.font16,
      color: theme.colors.blue,
      fontFamily: theme.fonts.Inter.regular,
    },
  });

  return (
    <View style={styles.container}>
      <ImageBackground
        source={images.singupScreen}
        style={styles.backgroundImage}>
        <View style={styles.mainView}>
          <Text style={styles.login}>{t('signupScreen.signup')}</Text>
          <Text style={styles.text}>{t('signupScreen.signupText')}</Text>
          <TextInput
            style={styles.textInput}
            placeholder={t('signupScreen.namePlaceholder')}
            placeholderTextColor={theme.colors.lightGray}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.textInput}
            placeholder={t('signupScreen.emailPlaceholder')}
            placeholderTextColor={theme.colors.lightGray}
            value={email}
            onChangeText={setEmail}
          />
          <View style={[styles.textInput, styles.textInputPassword]}>
            <TextInput
              placeholder={t('signupScreen.passwordPlaceholder')}
              style={styles.placeholder}
              placeholderTextColor={theme.colors.lightGray}
              value={password}
              secureTextEntry={!isPasswordVisible}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <Image
                source={
                  isPasswordVisible
                    ? icons.passwordInactive
                    : icons.passwordActive
                }
                style={{width: 24, height: 24}}
              />
            </TouchableOpacity>
          </View>
          <Pressable
            style={styles.button}
            onPress={() => navigation?.navigate('Onboarding')}>
            <Text style={styles.buttonText}>
              {t('signupScreen.signupButtonText')}
            </Text>
          </Pressable>
          <View style={styles.signupView}>
            <Text style={styles.signup}>{t('signupScreen.loginText')} </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={[styles.signupText]}>
                {t('signupScreen.loginText')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default SignupScreen;
