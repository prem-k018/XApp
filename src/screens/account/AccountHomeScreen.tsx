/* eslint-disable react/no-unstable-nested-components */
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';
import {icons} from '@app/assets/icons';
import StorageService from '@app/utils/storageService';
import {userInfo} from '@app/constants/constants';
import {button, view} from '@app/constants/constants';
import {images} from '@app/assets/images';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ScreenNames from '@app/constants/screenNames';
import {UserProfileResponse} from '@app/model/profile/userProfile';
import LoadingScreen from '../loadingScreen/loadingScreen';
import {showSessionExpiredAlert} from '@app/services/sessionExpiredService';
import {addEventForTracking} from '@app/services/tracking/rpiServices';
import {clearCacheDataAndNavigateToLogin} from '@app/utils/HelperFunction';
import {loadImageByAddingBaseUrl} from '@app/utils/imageLinkUtils';

const AccountHomeScreen: React.FC = () => {
  const {appConfigData} = useAppContext();
  const [userData, setUserData] = useState<UserProfileResponse>();
  const [isError, setIsError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [validUrl, setValidUrl] = useState<boolean>(false);

  useEffect(() => {
    getUserData({showLoader: true});
    const appViewTracking = async () => {
      const data = {
        ContentType: ScreenNames.accountHomeScreen,
        screenType: view,
      };
      await addEventForTracking(data);
    };
    appViewTracking();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getUserData({showLoader: !refreshing});
    }, []),
  );

  useEffect(() => {
    if (refreshing) {
      getUserData({showLoader: !refreshing});
    }
  }, [refreshing]);

  async function getUserData(options: {showLoader: boolean}) {
    const {showLoader} = options;
    setIsLoading(true);

    if (showLoader) {
      setIsError(null);
      setIsLoading(true);
    }
    try {
      const userInfoData = await StorageService.getData(userInfo);
      const contents = JSON.parse(userInfoData as any) || {};
      console.log('User Data ==>', contents);
      if ('data' in contents && contents?.data?.publish_viewProfile) {
        setUserData(contents);
        setIsLoading(false);
        if (refreshing) {
          setRefreshing(false);
        }
      } else if ('data' in contents && contents?.errors[0]) {
        showSessionExpiredAlert();
        console.log('Error', contents?.errors[0]?.message);
      } else {
        setIsError('Something went wrong!!!!'); // Set the error message
        setIsLoading(false);
        if (refreshing) {
          setRefreshing(false);
        }
      }
    } catch (err: any) {
      console.log(err.message);
      setIsLoading(false);
      if (refreshing) {
        setRefreshing(false);
      }
      return {} as any;
    }
  }

  const handleLogout = async () => {
    const data = {
      ContentType: ScreenNames.homeScreen,
      screenType: button,
      button_name: 'logout_button',
    };
    addEventForTracking(data);
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'No',
          onPress: () => console.log('Logout Request Cancelled'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            clearCacheDataAndNavigateToLogin();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const RenderItem = ({icon, title, onPress}: any) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        style={styles.content}>
        <View style={styles.contentIconView}>
          <Image source={icon} style={styles.contentIcon} />
        </View>
        <Text style={styles.text}>{title}</Text>
        <Image source={icons.backIcon} style={styles.forwardIcon} />
      </TouchableOpacity>
    );
  };

  const profileImage = loadImageByAddingBaseUrl(
    userData?.data.publish_viewProfile.image as any,
  );
  if (userData?.data.publish_viewProfile.image !== '') {
    const isValidImageUrl = async (profileImage: string) => {
      return Image.prefetch(profileImage)
        .then(() => {
          setValidUrl(true);
        })
        .catch(() => setValidUrl(false));
    };
    isValidImageUrl(profileImage);
  }

  const handleRetry = () => {
    getUserData({showLoader: true});
  };

  const onRefresh = () => {
    setRefreshing(true);
    scrollViewRef?.current?.scrollTo({animated: true, y: 0});
    getUserData({showLoader: true});
  };

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      marginTop: 1,
      paddingBottom: theme.cardPadding.mediumSize,
      justifyContent: 'space-between',
    },
    topContainer: {
      gap: theme.cardPadding.smallXsize,
    },
    headingView: {
      paddingTop: 33,
      paddingBottom: theme.cardPadding.mediumSize,
      backgroundColor: appConfigData?.background_color,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: theme.cardMargin.left,
    },
    headingText: {
      fontFamily: theme.fonts.DMSans.bold,
      fontSize: theme.fontSize.font24,
      color: appConfigData?.secondary_text_color,
    },
    profileDetails: {
      width: 150,
      paddingVertical: theme.cardPadding.defaultPadding,
      paddingHorizontal: theme.cardPadding.smallXsize,
      backgroundColor: appConfigData?.background_color,
      alignSelf: 'center',
      borderRadius: theme.border.borderRadius,
      marginVertical: 10,
    },
    profileImage: {
      width: '100%',
      height: 125,
      marginBottom: theme.cardPadding.defaultPadding,
      borderRadius: theme.border.borderRadius,
    },
    userName: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
      textAlign: 'center',
      marginBottom: 7,
    },
    businessNameText: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font12,
      color: appConfigData?.secondary_text_color,
      textAlign: 'center',
    },
    content: {
      paddingVertical: theme.cardPadding.defaultPadding,
      gap: theme.cardPadding.defaultPadding,
      paddingHorizontal: 10,
      marginHorizontal: 25,
      flexDirection: 'row',
      backgroundColor: appConfigData?.background_color,
      borderRadius: theme.border.borderRadius,
    },
    editProfile: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
      textAlign: 'center',
      borderRadius: theme.border.borderRadius,
      borderWidth: theme.border.borderWidth,
      borderColor: appConfigData?.secondary_text_color,
      paddingVertical: 10,
      width: '85%',
      marginTop: 20,
    },
    text: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
      alignSelf: 'center',
      textAlign: 'center',
    },
    contentIconView: {
      height: 36,
      width: 36,
      backgroundColor: '#EDEDED',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.border.borderRadius,
    },
    contentIcon: {
      tintColor: appConfigData?.secondary_text_color,
    },
    forwardIcon: {
      position: 'absolute',
      right: 15,
      top: 20,
      transform: [{rotate: '180deg'}],
    },
    buttonView: {
      marginHorizontal: 25,
      marginTop: 10,
      paddingVertical: theme.cardPadding.defaultPadding,
      borderRadius: theme.border.borderRadius,
      backgroundColor: theme.colors.red,
    },
    buttonText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.primary_text_color,
      textAlign: 'center',
    },
  });

  return isLoading ? (
    <LoadingScreen
      isLoading={isLoading}
      error={isError}
      onRetry={handleRetry}
    />
  ) : (
    <ScrollView
      contentContainerStyle={styles.container}
      ref={scrollViewRef}
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="gray"
        />
      }>
      <View style={styles.topContainer}>
        <View style={styles.headingView}>
          <Text style={styles.headingText}>Account</Text>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              navigation?.navigate(ScreenNames.editProfileScreen, {
                data: userData,
              })
            }>
            <Image source={icons.edit} />
          </TouchableOpacity>
        </View>
        <View style={styles.profileDetails}>
          <Image
            resizeMode="contain"
            source={
              validUrl
                ? {uri: profileImage}
                : userData?.data?.publish_viewProfile?.gender?.toLowerCase() ===
                  'female'
                ? images.femaleProfileAvatar
                : images.profileAvatar
            }
            style={styles.profileImage}
          />
          <Text style={styles.userName}>
            {userData?.data?.publish_viewProfile?.first_name}{' '}
            {userData?.data?.publish_viewProfile?.last_name}
          </Text>
          <Text style={styles.businessNameText}>Business Name</Text>
          <Text
            style={[
              styles.businessNameText,
              {color: appConfigData?.primary_color},
            ]}>
            Fury Fashion
          </Text>
        </View>
        <RenderItem
          icon={icons.account_inactive}
          title="My Profile"
          onPress={() => navigation?.navigate(ScreenNames.userProfileScreen)}
        />
        <RenderItem
          icon={icons.rewardsIcon}
          title="Loyalty Profile"
          onPress={() => navigation?.navigate(ScreenNames.loyaltyProfileScreen)}
        />
        <RenderItem
          icon={icons.rewardStar}
          title="Rewards"
          onPress={() => navigation?.navigate(ScreenNames.rewardsManagement)}
        />
        <RenderItem
          icon={icons.languageIcon}
          title="Language"
          onPress={() => console.log('Language')}
        />
        <RenderItem
          icon={icons.helpCenterIcon}
          title="Change Environment"
          onPress={() => navigation?.navigate(ScreenNames.environmentSetup)}
        />
      </View>
      <TouchableOpacity
        onPress={handleLogout}
        activeOpacity={1}
        style={styles.buttonView}>
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AccountHomeScreen;
