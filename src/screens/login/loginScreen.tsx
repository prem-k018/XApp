/* eslint-disable react-native/no-inline-styles */
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Dimensions,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {useState} from 'react';
import {icons} from '@app/assets/icons';
import {useNavigation} from '@react-navigation/native';
import LoadingScreen from '../loadingScreen/loadingScreen';
import {getLoginData} from '@app/services/loginService';
import initializeEnvironment, {isEmailValid} from '@app/utils/HelperFunction';
import {loginFailedMsg} from '@app/constants/errorMessage';
import StorageService from '@app/utils/storageService';
import {
  button,
  customSchemaEvent,
  language,
  loginToken,
  refreshScreenData,
  storedUserID,
  userEmail,
  userInfo,
  userMemberId,
  view,
} from '@app/constants/constants';
import AlertUtil from '@app/utils/alertUtils';
import {EventRegister} from 'react-native-event-listeners';
import i18next, {languageResources} from '@app/services/LocalizationService';
import {useTranslation} from 'react-i18next';
import nativeName from '@app/resource/languages/nativeName.json';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';
import ScreenNames from '@app/constants/screenNames';
import {addEventForTracking} from '@app/services/tracking/rpiServices';
import {getCustomSchemaEvent} from '@app/services/tracking/customSchemaEvent';
import getUserProfileData from '@app/services/profile/userProfileService';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [focusedInput, setFocusedInput] = useState<any>(null);
  const {appConfigData, addUserData} = useAppContext();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const {t} = useTranslation();
  const changeLng = async (lng: string) => {
    try {
      await StorageService.storeData(language, lng);
      i18next.changeLanguage(lng);
      setIsVisible(false);
    } catch (error) {
      console.error('Error storing language:', error);
    }
  };

  useEffect(() => {
    const appViewTracking = async () => {
      const data = {ContentType: ScreenNames.loginScreen, screenType: view};
      await addEventForTracking(data);
    };
    appViewTracking();
  }, []);
  const onPressCallback = () => {
    setIsError(null);
    setIsLoading(false);
  };

  useEffect(() => {
    let emailWithoutSpace = email.trimStart();
    let passwordWithoutSpace = password.trimStart();
    if (emailWithoutSpace.length !== 0 && passwordWithoutSpace.length !== 0) {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, [email, password]);

  const handleLogin = () => {
    let emailWithoutSpace = email.trimStart();
    let passwordWithoutSpace = password.trimStart();

    if (emailWithoutSpace.length !== 0 && passwordWithoutSpace.length !== 0) {
      if (isEmailValid(emailWithoutSpace)) {
        login({
          showLoader: true,
          enteredEmail: emailWithoutSpace,
          enteredPassword: passwordWithoutSpace,
        });
      } else {
        AlertUtil.showAlert(
          loginFailedMsg,
          t('loginScreen.emailValidation'),
          '',
          onPressCallback,
        );
      }
    } else {
      AlertUtil.showAlert(
        loginFailedMsg,
        t('loginScreen.emailValidation'),
        '',
        onPressCallback,
      );
    }
  };

  const getCustomSchemaEventList = async () => {
    try {
      const contents = await getCustomSchemaEvent();
      if (
        'data' in contents &&
        contents?.data?.users_getCustomEventSchemaList
      ) {
        const data = contents?.data?.users_getCustomEventSchemaList;
        await StorageService.storeData(customSchemaEvent, JSON.stringify(data));
      } else {
        setIsError('Something went Wrong!!');
      }
    } catch (err: any) {
      console.log(err.message);
    }
  };

  async function getUserData(userId: string) {
    try {
      const contents = await getUserProfileData(userId as string);
      if ('data' in contents && contents?.data?.publish_viewProfile) {
        await StorageService.storeData(userInfo, JSON.stringify(contents));
        await StorageService.storeData(
          userMemberId,
          contents?.data?.publish_viewProfile?.member_id,
        );
      } else {
        setIsError('Something went wrong!!!!'); // Set the error message
      }
    } catch (err: any) {
      console.log(err.message);
    }
  }

  async function login(options: any) {
    await initializeEnvironment();

    const {showLoader, enteredEmail, enteredPassword} = options;
    const data = {
      ContentType: ScreenNames.loginScreen,
      screenType: button,
      button_name: 'login_button',
    };
    addEventForTracking(data);
    try {
      if (showLoader) {
        setIsLoading(true);
        setIsError(null);
      }

      const contents = await getLoginData(enteredEmail, enteredPassword);

      if ('data' in contents && contents.data) {
        addUserData(contents);
        await StorageService.storeData(loginToken, contents.data.tokens);
        await StorageService.storeData(storedUserID, contents.data.user_id);
        await StorageService.storeData(userEmail, contents.data.email_id);
        await getUserData(contents.data.user_id);
        setEmail('');
        setPassword('');
        EventRegister.emit(refreshScreenData);
        setFocusedInput(null);
        await getCustomSchemaEventList();
        navigation?.replace('Home');
      } else {
        setIsLoading(false);
        AlertUtil.showAlert(loginFailedMsg, t('loginScreen.loginError'));
      }
      setIsError(null);
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setIsError(null);
      AlertUtil.showAlert(loginFailedMsg, t('loginScreen.loginError'));
    }
  }

  const handleRetry = () => {
    login({showLoader: true});
  };

  const handleSettings = () => {
    navigation.navigate(ScreenNames.environmentSetup);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    mainView: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      flex: 1,
      paddingTop: 150,
    },
    backgroundImage: {
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
      backgroundColor: 'rgba(255, 255, 255, 1)',
    },

    backgroundImageLogo: {
      width: Dimensions.get('window').width,
      height: 278,
      resizeMode: 'contain',
      marginTop: 'auto',
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
      color: appConfigData?.secondary_text_color,
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
      marginTop: 16,
    },
    buttonText: {
      fontFamily: theme.fonts.HCLTechRoobert.semiBold,
      paddingVertical: 12,
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

  return isLoading ? (
    <LoadingScreen
      isLoading={isLoading}
      error={isError}
      onRetry={handleRetry}
    />
  ) : (
    <View style={styles.container}>
      <View style={styles.backgroundImage}>
        <Modal visible={isVisible} onRequestClose={() => setIsVisible(false)}>
          <SafeAreaView>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <FlatList
                data={Object.keys(languageResources)}
                renderItem={({item}: any) => (
                  <TouchableOpacity onPress={() => changeLng(item)}>
                    <Text style={{fontSize: 30, color: 'black'}}>
                      {(nativeName as any)[item].nativeName}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </SafeAreaView>
        </Modal>
        <View style={styles.mainView}>
          <Text style={styles.login}>{t('loginScreen.login')}</Text>
          <Text style={styles.text}>{t('loginScreen.loginText')}</Text>
          <TextInput
            style={[
              styles.textInput,
              focusedInput == 'email'
                ? {borderColor: appConfigData?.secondary_text_color}
                : {},
            ]}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder={t('loginScreen.emailPlaceholder')}
            placeholderTextColor={theme.colors.lightGray}
            value={email}
            onFocus={() => setFocusedInput('email')}
            onBlur={() => setFocusedInput(null)}
            onChangeText={setEmail}
          />
          <View
            style={[
              styles.textInput,
              styles.textInputPassword,
              focusedInput == 'password'
                ? {borderColor: appConfigData?.secondary_text_color}
                : {},
            ]}>
            <TextInput
              placeholder={t('loginScreen.passwordPlaceholder')}
              autoCapitalize="none"
              autoCorrect={false}
              style={[styles.placeholder]}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
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
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.button,
              isButtonDisabled
                ? {backgroundColor: theme.colors.primaryBlack}
                : {backgroundColor: '#EDEDED'},
            ]}
            onPress={() => (isButtonDisabled ? handleLogin() : null)}>
            <Text
              style={[
                styles.buttonText,
                isButtonDisabled
                  ? {color: appConfigData?.primary_text_color}
                  : {color: '#838589'},
              ]}>
              {t('loginScreen.loginButtonText')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.button,
              {backgroundColor: theme.colors.primaryBlack},
            ]}
            onPress={handleSettings}>
            <Text
              style={[
                styles.buttonText,
                {color: appConfigData?.primary_text_color},
              ]}>
              Settings
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={[styles.button, {marginTop: 14}]}
            onPress={() => setIsVisible(true)}>
            <Text style={styles.buttonText}>Change Language</Text>
          </TouchableOpacity> */}
          {/* <Image
            style={styles.backgroundImageLogo}
            source={images.loginScreenlogo}
          /> */}
          {/* <View style={styles.signupView}>
            <Text style={styles.signup}>{t('loginScreen.signupText')} </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignupScreen')}>
              <Text style={[styles.signupText]}>{t('loginScreen.signup')}</Text>
            </TouchableOpacity>
          </View>*/}
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
