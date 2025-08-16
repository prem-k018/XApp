import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAppContext} from '@app/store/appContext';
import DefaultHeader from '@app/components/ui-components/defaultHeader';
import LoadingScreen from '../loadingScreen/loadingScreen';
import {theme} from '@app/constants';
import getUserOLProfileData from '@app/services/profile/userOLProfile';
import {UserOLProfileData} from '@app/model/profile/userOLProfile';
import {sessionTimeout} from '@app/constants/errorCodes';
import OLProfileDetails from '@app/components/UserOLProfile/OLProfileDetails';
import {LoyaltyTierListResponse} from '@app/model/openLoyalty/OLTierList';
import getLoyaltyTierList from '@app/services/openLoyalty/OLTierList';
import OLPointsBreakout from '@app/components/UserOLProfile/OLPointsBreakout';
import getOLMemberTranactions from '@app/services/openLoyalty/OLMemberTransaction';
import {MemberTransactionsResponse} from '@app/model/openLoyalty/OLMemberTransaction';
import StorageService from '@app/utils/storageService';
import {
  userEmail,
  userInfo,
  userMemberId,
  view,
} from '@app/constants/constants';
import OLLeaderBoard from '@app/components/UserOLProfile/OLLeaderBoard';
import OLReferalCode from '@app/components/UserOLProfile/OLReferalCode';
import {UserProfileResponse} from '@app/model/profile/userProfile';
import ScreenNames from '@app/constants/screenNames';
import {addEventForTracking} from '@app/services/tracking/rpiServices';
import getCampaignList from '@app/services/openLoyalty/OLCampaignList';
import {CampaignListResponse} from '@app/model/openLoyalty/OLCampaignList';
import getMyStoriesData from '@app/services/myStoriesService';
import {MyStory} from '@app/model/myStories';

const LoyaltyProfileScreen: React.FC = () => {
  const {appConfigData} = useAppContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [userOLData, setUserOLData] = useState<UserOLProfileData | null>(null);
  const [userData, setUserData] = useState<UserProfileResponse>();
  const [loyaltyTierListData, setLoyaltyTierListData] =
    useState<LoyaltyTierListResponse | null>(null);
  const [OLTransactionData, setOLTransactionData] =
    useState<MemberTransactionsResponse | null>(null);
  const [contentPaginationStartIndex, setcontentPaginationStartIndex] =
    useState(0);
  const [campaignData, setCampaignData] = useState<CampaignListResponse | null>(
    null,
  );
  const [spinWheelData, setSpinWheelData] = useState<MyStory[]>([]);
  const [spinLoading, setSpinLoading] = useState<boolean>(false);

  const pageSize = 10;

  useEffect(() => {
    const appViewTracking = async () => {
      const data = {
        ContentType: ScreenNames.loyaltyProfileScreen,
        screenType: view,
      };
      await addEventForTracking(data);
    };
    appViewTracking();
  }, []);

  useEffect(() => {
    loadData({showLoader: true});
    getUserData();
    getSpinWheelData();
  }, []);

  useEffect(() => {
    if (refreshing) {
      loadData({showLoader: !refreshing});
    }
  }, [refreshing]);

  async function loadData(options: {showLoader: boolean}) {
    const {showLoader} = options;
    setIsLoading(true);

    try {
      if (showLoader) {
        setIsError(null);
        setIsLoading(true);
      }

      const [
        userOLResponse,
        tierResponse,
        OLMemberTransaction,
        campaignResponse,
      ] = await Promise.all([
        getUserOLData(),
        getLoyaltyTierData(),
        getOLMemberTranactionsData(),
        getNewChallengesData(),
      ]);
      setUserOLData(userOLResponse);
      setLoyaltyTierListData(tierResponse);
      setOLTransactionData(OLMemberTransaction);
      setCampaignData(campaignResponse);
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
      if ('data' in contents && contents?.data?.publish_viewProfile) {
        setUserData(contents);
      }
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

  async function getOLMemberTranactionsData() {
    try {
      const userEmailId = await StorageService.getData(userEmail);
      const contents = await getOLMemberTranactions(userEmailId as string);
      return contents;
    } catch (err: any) {
      console.log(err.message);
      return {} as any;
    }
  }

  async function getNewChallengesData() {
    try {
      const pagination = {start: contentPaginationStartIndex, rows: pageSize};
      const isLeaderBoard = true;
      const contents = await getCampaignList(pagination, isLeaderBoard);
      return contents;
    } catch (err: any) {
      console.log(err.message);
      return {} as any;
    }
  }

  async function getSpinWheelData() {
    try {
      setSpinLoading(true);

      let tagLists: string[] = ['Wheel'];
      let cdpFilterLists: string[] = [];

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
        setSpinWheelData(newData);
      }
    } catch (err: any) {
      console.log(err.message);
    } finally {
      setSpinLoading(false);
    }
  }

  const onRefresh = () => {
    setRefreshing(true);
    loadData({showLoader: true});
    getUserData();
    getSpinWheelData();
  };

  const handleRetry = () => {
    loadData({showLoader: true});
    getUserData();
    getSpinWheelData();
  };

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: appConfigData?.background_color,
    },
    divider: {
      borderBottomWidth: theme.border.borderWidth,
      borderBottomColor: '#EDEDED',
      marginHorizontal: theme.cardMargin.left,
    },
  });

  return isLoading ? (
    <>
      <DefaultHeader header="Loyalty Points" />
      <LoadingScreen
        isLoading={isLoading}
        error={isError}
        onRetry={handleRetry}
      />
    </>
  ) : (
    <>
      <DefaultHeader header="Loyalty Points" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="gray"
          />
        }>
        <OLProfileDetails
          data={userOLData?.data?.users_userOLProfile ?? {}}
          tierData={loyaltyTierListData?.data?.users_getTierList ?? []}
          profileData={userData?.data?.publish_viewProfile}
        />
        <View style={styles.divider} />
        <OLPointsBreakout
          profileData={userOLData?.data?.users_userOLProfile ?? {}}
          data={OLTransactionData?.data?.users_fetchMemberTransactions ?? []}
          tierData={loyaltyTierListData?.data?.users_getTierList ?? []}
        />
        <View style={styles.divider} />
        <OLLeaderBoard
          campaignData={campaignData?.data?.users_getCampaignList ?? []}
        />
        <OLReferalCode
          referalCode={
            userOLData?.data?.users_userOLProfile?.userProfileInfo
              ?.referalCode ?? ''
          }
          spinLoading={spinLoading}
          spinWheelData={spinWheelData}
        />
      </ScrollView>
    </>
  );
};

export default LoyaltyProfileScreen;
