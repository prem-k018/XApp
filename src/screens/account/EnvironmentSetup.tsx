/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import StorageService from '@app/utils/storageService';
import {environment, siteHost, view} from '@app/constants/constants';
import {theme} from '@app/constants';
import {useAppContext} from '@app/store/appContext';
import DefaultHeader from '@app/components/ui-components/defaultHeader';
import DropDownPicker from 'react-native-dropdown-picker';
import {APIConfig, Environment} from '@app/services/ApiConfig';
import {clearCacheDataAndNavigateToLogin} from '@app/utils/HelperFunction';
import {addEventForTracking} from '@app/services/tracking/rpiServices';
import ScreenNames from '@app/constants/screenNames';

const EnvironmentSetup: React.FC = () => {
  const {appConfigData} = useAppContext();
  const [environmentName, setEnvironmentName] = useState<string>('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [focusedInput, setFocusedInput] = useState<any>(null);
  const [environmentValue, setEnvironmentValue] = useState('');
  const [environments, setEnvironments] = useState([
    {label: 'DEV', value: 'dev'},
    {label: 'STG', value: 'stg'},
    {label: 'QA', value: 'qa'},
    {label: 'PROD', value: 'prod'},
    {label: 'KIWI', value: 'kiwi'},
  ]);
  const [environmentOpen, setEnvironmentOpen] = useState(false);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedEnvironment = await StorageService.getData(environment);
        const storedSiteHost = await StorageService.getData(siteHost);
        console.log('Retrieve Environment Data');

        if (storedEnvironment) setEnvironmentValue(storedEnvironment);
        if (storedSiteHost) setEnvironmentName(storedSiteHost);
      } catch (error) {
        console.error('Error retrieving stored data:', error);
      }
    };

    loadStoredData();
  }, []);
  useEffect(() => {
    const appViewTracking = async () => {
      const data = {
        ContentType: ScreenNames.environmentSetup,
        screenType: view,
      };
      await addEventForTracking(data);
    };
    appViewTracking();
  }, []);

  useEffect(() => {
    APIConfig.setEnvironment(Environment.Dev); // Replace with your environment
  }, [environmentValue]);

  useEffect(() => {
    if (environmentName && environmentValue) {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, [environmentName, environmentValue]);

  const onEnvironmentOpen = useCallback(() => {}, []);

  function validateSiteHost(siteHost: string): boolean {
    const regex = /^[a-z]+\.([^\.\s]*hcl[^\.\s]*)\.com$/i;

    return regex.test(siteHost);
  }

  const handleUpdateEnv = async () => {
    Alert.alert(
      'Update Environment',
      'Are you sure you want to update the environment?',
      [
        {
          text: 'No',
          style: 'cancel',
          onPress: () => console.log('Environment update cancelled'),
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await StorageService.storeData(environment, environmentValue);
              await StorageService.storeData(siteHost, environmentName);
              await clearCacheDataAndNavigateToLogin();
            } catch (error) {
              console.error('Error storing environment:', error);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      gap: 20,
      marginTop: 1,
      paddingVertical: 25,
      paddingHorizontal: 25,
      backgroundColor: appConfigData?.background_color,
    },
    modelContainer: {
      flexGrow: 1,
      gap: 20,
      marginTop: 1,
      paddingVertical: 5,
      paddingHorizontal: 5,
      backgroundColor: appConfigData?.background_color,
    },
    title: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
    },
    input: {
      backgroundColor: '#FAFAFA',
      borderRadius: theme.border.borderRadius,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderColor: '#FAFAFA',
      height: 53,
      paddingVertical: theme.cardPadding.defaultPadding,
    },
    bigInput: {
      height: 70,
    },
    countryView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 20,
      marginTop: theme.cardMargin.right,
      marginRight: theme.cardMargin.right,
    },
    city: {
      gap: 20,
      width: '40%',
    },
    country: {
      gap: 20,
      width: '60%',
    },
    bottomView: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: appConfigData?.background_color,
    },
    bottomViewModel: {
      marginTop: theme.cardPadding.mediumSize,
      paddingBottom: theme.cardPadding.mediumSize,
      justifyContent: 'flex-end',
      backgroundColor: appConfigData?.background_color,
    },
    buttonView: {
      paddingVertical: 15,
      backgroundColor: appConfigData?.secondary_color,
      borderRadius: theme.border.borderRadius,
    },
    buttonText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.primary_text_color,
      alignSelf: 'center',
    },
    orderConfirmedText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font24,
      color: appConfigData?.secondary_text_color,
      alignSelf: 'center',
    },
    orderRedeemPoint: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.primary_color,
      alignSelf: 'center',
    },
    text: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font18,
      color: '#838589',
      textAlign: 'center',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rewartPointImg: {
      alignSelf: 'center',
      alignContent: 'center',
      flexDirection: 'row',
      gap: 2,
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    rewardIcon: {width: 25, height: 15, resizeMode: 'contain'},
    modelBottomView: {
      marginBottom: 32,
      marginHorizontal: 25,
      gap: 20,
    },
    underLine: {
      color: appConfigData?.primary_color,
      textDecorationLine: 'underline',
    },
    orderButtonView: {
      paddingVertical: 15,
      borderWidth: theme.border.borderWidth,
      borderColor: appConfigData?.secondary_text_color,
      borderRadius: theme.border.borderRadius,
    },
    maintContainers: {
      flex: 1,
      marginBottom: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });

  return (
    <>
      <DefaultHeader header="Environment Setup" />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Site Host</Text>
          <TextInput
            style={[
              styles.input,
              styles.title,
              focusedInput == 'name'
                ? {borderColor: appConfigData?.secondary_text_color}
                : {},
            ]}
            value={environmentName}
            onFocus={() => setFocusedInput('name')}
            onBlur={() => setFocusedInput(null)}
            placeholder="Site Host(eg:- du.hcl-x.com)"
            placeholderTextColor={theme.colors.lightGray}
            onChangeText={setEnvironmentName}
            returnKeyType="next"
            autoCapitalize="none"
            blurOnSubmit={false}
          />
          <Text style={styles.title}>Choose Environment</Text>
          <View style={{flex: 1, height: 20}}>
            <DropDownPicker
              open={environmentOpen}
              value={environmentValue}
              items={environments}
              setOpen={setEnvironmentOpen}
              placeholder="Select Environment"
              onOpen={onEnvironmentOpen}
              setValue={setEnvironmentValue}
              zIndex={2000}
              zIndexInverse={1000}
              listMode="SCROLLVIEW"
            />
          </View>
          <View style={styles.bottomView}>
            <TouchableOpacity
              onPress={() => (isButtonDisabled ? handleUpdateEnv() : null)}
              activeOpacity={1}
              style={[
                styles.buttonView,
                isButtonDisabled
                  ? {backgroundColor: theme.colors.primaryBlack}
                  : {backgroundColor: '#EDEDED'},
              ]}>
              {isLoading ? (
                <ActivityIndicator color={theme.colors.primaryWhite} />
              ) : (
                <Text
                  style={[
                    styles.buttonText,
                    isButtonDisabled
                      ? {color: appConfigData?.primary_text_color}
                      : {color: '#838589'},
                  ]}>
                  Apply Changes
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default EnvironmentSetup;
