import {
  ActivityIndicator,
  Image,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useAppContext} from '@app/store/appContext';
import StorageService from '@app/utils/storageService';
import {
  globalSettingData,
  tagListArray,
  userInfo,
  userMemberId,
  view,
} from '@app/constants/constants';
import {sessionTimeout} from '@app/constants/errorCodes';
import DefaultHeader from '@app/components/ui-components/defaultHeader';
import {icons} from '@app/assets/icons';
import LoadingScreen from '../loadingScreen/loadingScreen';
import ProfileDetails from '@app/components/UserProfile/ProfileDetails';
import getLoyaltyTierList from '@app/services/openLoyalty/OLTierList';
import {UserProfileResponse} from '@app/model/profile/userProfile';
import {LoyaltyTierListResponse} from '@app/model/openLoyalty/OLTierList';
import LoyaltyTierRank from '@app/components/UserProfile/LoyaltyTierRank';
import {theme} from '@app/constants';
import LinearGradient from 'react-native-linear-gradient';
import getCampaignList from '@app/services/openLoyalty/OLCampaignList';
import CampaignChallenges from '@app/components/UserProfile/CampaignChallenges';
import {CampaignListResponse} from '@app/model/openLoyalty/OLCampaignList';
import ScreenNames from '@app/constants/screenNames';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CardTypes from '@app/components/cards/cardTypes';
import FavouriteCarousel from '@app/components/carousels/favouriteCarousel';
import getUserOLProfileData from '@app/services/profile/userOLProfile';
import {UserOLProfileData} from '@app/model/profile/userOLProfile';
import {SiteSettings} from '@app/model/globalSetting';
import getContentDetail from '@app/services/contentType/contentDetail';
import {ContentDetail} from '@app/model/contentType/contentDetail';
import {loadImageByAddingBaseUrl} from '@app/utils/imageLinkUtils';
import {addEventForTracking} from '@app/services/tracking/rpiServices';
import getMyStoriesData from '@app/services/myStoriesService';
import {MyStory} from '@app/model/myStories';

const UserProfileScreen: React.FC = () => {
  const {appConfigData} = useAppContext();
  const scrollViewRef = useRef<ScrollView | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserProfileResponse>();
  const [userOLData, setUserOLData] = useState<UserOLProfileData | null>(null);
  const [loyaltyTierListData, setLoyaltyTierListData] =
    useState<LoyaltyTierListResponse | null>(null);
  const [campaignData, setCampaignData] = useState<CampaignListResponse | null>(
    null,
  );
  const [globalData, setGlobalData] = useState<SiteSettings | null>(null);
  const [videoData, setVideoData] = useState<ContentDetail | null>(null);
  const [promoData, setPromoData] = useState<any>();
  const [tagListData, setTagListData] = useState<MyStory[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [myStoriesLoading, setMyStoriesLoading] = useState<boolean>(false);
  const [currentTierName, setCurrentTierName] = useState<string>('');
  const [contentPaginationStartIndex, setcontentPaginationStartIndex] =
    useState(0);

  const pageSize = 20;

  useEffect(() => {
    const appViewTracking = async () => {
      const data = {
        ContentType: ScreenNames.userProfileScreen,
        screenType: view,
      };
      await addEventForTracking(data);
    };
    appViewTracking();
  }, []);

  const handleTierNameChange = (tierName: string) => {
    setCurrentTierName(tierName);
  };

  const thumbnailImage = loadImageByAddingBaseUrl(
    videoData?.Thumbnail as string,
  );

  useEffect(() => {
    loadData({showLoader: true});
    getGlobalSettingsData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const loadUserData = async () => {
        const userInfoData = await StorageService.getData(userInfo);
        const contents = JSON.parse(userInfoData as any) || {};
        if ('data' in contents && contents?.data?.publish_viewProfile) {
          setUserData(contents);
        } else {
          setIsError('Something went wrong!!!!');
        }
      };
      loadUserData();
      getTagListData()
        .then(() => setMyStoriesLoading(false))
        .catch(() => setMyStoriesLoading(false));
    }, []),
  );

  useEffect(() => {
    if (refreshing) {
      loadData({showLoader: !refreshing});
    }
    getGlobalSettingsData();
  }, [refreshing]);

  async function loadData(options: {showLoader: boolean}) {
    const {showLoader} = options;
    setIsLoading(true);

    try {
      if (showLoader) {
        setIsError(null);
        setIsLoading(true);
      }

      const [userResponse, userOLResponse, tierResponse, campaignResponse] =
        await Promise.all([
          getUserData(),
          getUserOLData(),
          getLoyaltyTierData(),
          getNewChallengesData(),
        ]);
      if ('data' in userResponse && userResponse?.data?.publish_viewProfile) {
        setUserData(userResponse);
      } else {
        setIsError('Something went wrong!!!!'); // Set the error message
      }
      setUserOLData(userOLResponse);
      if ('data' in tierResponse && tierResponse?.data?.users_getTierList) {
        setLoyaltyTierListData(tierResponse);
      } else {
        setIsError('Something went wrong!!!!');
      }
      if (
        'data' in campaignResponse &&
        campaignResponse?.data?.users_getCampaignList
      ) {
        setCampaignData(campaignResponse);
      } else {
        setIsError('Something went wrong!!!!');
      }
      setIsLoading(false);
      if (refreshing) {
        setRefreshing(false);
      }
    } catch (err: any) {
      setIsError('Something went wrong!');
      setIsLoading(false);
      if (refreshing) {
        setRefreshing(false);
      }
      console.log(err.message);
      if (err.message !== sessionTimeout) {
        setIsError('Something went wrong!!!!');
      }
    }
  }

  async function getUserData() {
    try {
      const userInfoData = await StorageService.getData(userInfo);
      const contents = JSON.parse(userInfoData as any) || {};
      return contents;
    } catch (err: any) {
      console.log(err.message);
      return {} as any;
    }
  }

  async function getUserOLData() {
    try {
      const memberId = await StorageService.getData(userMemberId);
      const contents = await getUserOLProfileData(memberId as string);
      return contents;
    } catch (err: any) {
      console.log(err.message);
      return {} as any;
    }
  }

  async function getLoyaltyTierData() {
    try {
      const contents = await getLoyaltyTierList();
      return contents;
    } catch (err: any) {
      console.log(err.message);
      return {} as any;
    }
  }

  async function getNewChallengesData() {
    try {
      const pagination = {start: contentPaginationStartIndex, rows: pageSize};
      const contents = await getCampaignList(pagination);
      return contents;
    } catch (err: any) {
      console.log(err.message);
      return {} as any;
    }
  }

  async function getGlobalSettingsData() {
    try {
      const settingData = await StorageService.getData(globalSettingData);
      const contents = JSON.parse(settingData as any) || {};
      setGlobalData(contents);
      const data = JSON.parse(contents?.promo_content || ('[]' as any)) as any;
      console.log('Promo content ==>', promoData);
      const pagePath = data[0]?.Id;
      setPromoData(data[0]);
      if (pagePath) {
        getPromoContentData(pagePath);
      }
    } catch (err: any) {
      console.log(err.message);
      return {} as any;
    }
  }

  async function getPromoContentData(pagePath: string) {
    try {
      const type = 'VOD';
      const contents = await getContentDetail(pagePath as any, type);
      if ('data' in contents && contents?.data?.publish_contentDetail) {
        setVideoData(contents?.data?.publish_contentDetail);
      }
    } catch (err: any) {
      console.log(err.message);
      return {} as any;
    }
  }

  async function getTagListData() {
    try {
      setMyStoriesLoading(true);

      let tagLists: string[] = [];
      const settingData = await StorageService.getData(globalSettingData);
      const tagData = JSON.parse(settingData as any) || {};
      const tagListObject = tagData?.site_assigned_content_types;
      console.log('Global Data ===>', tagListObject);
      if (tagListObject) {
        tagLists = tagListObject;
      }

      let cdpFilterLists: string[] = [];
      const cdpFilterListObject = await StorageService.getData(tagListArray);
      if (cdpFilterListObject) {
        cdpFilterLists = JSON.parse(cdpFilterListObject);
      }

      const pagination = {start: 0, rows: 20};
      const searchTerm = '';
      const tags = tagLists;
      const cdpFilter = cdpFilterLists;
      const filter = 'ALL';
      const isSuggestive = false;

      // Call the fetchGraphQLData function with input parameters
      const contents = await getMyStoriesData(
        pagination,
        searchTerm,
        tags,
        cdpFilter,
        filter,
        isSuggestive,
      );

      if ('data' in contents && contents?.data?.publish_fetchEcomProducts) {
        const newData = contents?.data?.publish_fetchEcomProducts;
        const tagsData = newData?.filter((item: any) =>
          Object?.values(CardTypes)?.includes(item?.ContentType),
        );
        setTagListData(tagsData);
      }
    } catch (err: any) {
      console.log(err.message);
    } finally {
      setMyStoriesLoading(false);
    }
  }

  const MyStories = () => {
    if (myStoriesLoading) {
      return (
        <View style={{paddingVertical: 20, alignItems: 'center'}}>
          <ActivityIndicator
            size="large"
            color={appConfigData?.primary_color}
          />
        </View>
      );
    }

    if (tagListData.length > 0) {
      return <FavouriteCarousel data={tagListData} inUserProfile={true} />;
    } else {
      return null;
    }
  };

  const handleRetry = () => {
    loadData({showLoader: true});
    getGlobalSettingsData();
  };

  const onRefresh = () => {
    setRefreshing(true);
    scrollViewRef?.current?.scrollTo({animated: true, y: 0});
    loadData({showLoader: true});
    getGlobalSettingsData();
    getTagListData()
      .then(() => setMyStoriesLoading(false))
      .catch(() => setMyStoriesLoading(false));
  };

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingBottom: 24,
      marginTop: 1,
      backgroundColor: appConfigData?.background_color,
    },
    achievementContainer: {
      marginHorizontal: theme.cardMargin.left,
      marginBottom: theme.cardPadding.carMargin,
      borderRadius: theme.border.borderRadius,
      paddingVertical: theme.cardPadding.defaultPadding,
      paddingHorizontal: theme.cardPadding.mediumSize,
      gap: theme.cardMargin.xSmall,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    text: {
      fontFamily: theme.fonts.Inter.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.primary_text_color,
    },
    textScore: {
      fontFamily: theme.fonts.Inter.bold,
      fontSize: theme.fontSize.font28,
      color: appConfigData?.primary_text_color,
    },
    divider: {
      backgroundColor: '#5D5B9E',
      width: 1.5,
    },
    trailer: {
      marginBottom: theme.cardPadding.mediumSize,
      borderRadius: theme.border.borderRadius,
      overflow: 'hidden',
      height: 324,
      marginHorizontal: theme.cardMargin.left,
    },
    thumbnailImage: {
      height: '100%',
      width: '100%',
    },
    videoIcon: {
      position: 'absolute',
      left: '45%',
      top: '45%',
    },
  });

  return isLoading ? (
    <>
      <DefaultHeader header="My Profile" icon1={icons.edit} />
      <LoadingScreen
        isLoading={isLoading}
        error={isError}
        onRetry={handleRetry}
      />
    </>
  ) : (
    <>
      <DefaultHeader
        header="My Profile"
        icon1={icons.edit}
        onPressIcon1={() =>
          navigation?.navigate(ScreenNames.editProfileScreen, {data: userData})
        }
      />
      <ScrollView
        ref={scrollViewRef}
        nestedScrollEnabled
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="gray"
          />
        }>
        <ProfileDetails
          data={userData?.data?.publish_viewProfile ?? {}}
          currentTierName={currentTierName}
        />
        {loyaltyTierListData?.data?.users_getTierList?.length !== 0 && (
          <LoyaltyTierRank
            data={loyaltyTierListData?.data?.users_getTierList ?? []}
            totalPoints={
              userOLData?.data?.users_userOLProfile?.userPointsInfo
                ?.totalEarnedPoints
            }
            onTierNameChange={handleTierNameChange}
          />
        )}
        <CampaignChallenges
          data={campaignData?.data?.users_getCampaignList ?? []}
        />
        <LinearGradient
          colors={['#7165EB', '#908FEC']}
          style={styles.achievementContainer}>
          <View>
            <Text style={styles.text}>Achievements</Text>
            <Text style={styles.textScore}>08</Text>
          </View>
          <View style={styles.divider}></View>
          <View>
            <Text style={styles.text}>Accomplishments</Text>
            <Text style={styles.textScore}>12</Text>
          </View>
        </LinearGradient>
        {videoData && (
          <TouchableOpacity
            style={styles.trailer}
            activeOpacity={1}
            onPress={() => {
              navigation.navigate(ScreenNames.reelsScreen, {
                data: promoData,
              });
            }}>
            <ImageBackground
              source={{uri: thumbnailImage}}
              style={styles.thumbnailImage}>
              <Image source={icons.videoButton} style={styles.videoIcon} />
            </ImageBackground>
          </TouchableOpacity>
        )}
        {globalData?.disable_my_stories && <MyStories />}
      </ScrollView>
    </>
  );
};

export default UserProfileScreen;
