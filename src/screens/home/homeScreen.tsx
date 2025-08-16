/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
  AppState,
} from 'react-native';
import CardType from '@app/components/cards/cardTypes';
import Carousels from '@app/components/carousels/carousels';
import CarouselTypes from '@app/components/carousels/carouselTypes';
import getHomeScreenData from '@app/services/homeScreenService';
import {Content} from '@app/model/content';
import LoadingScreen from '../loadingScreen/loadingScreen';
import {
  globalSettingData,
  refreshScreenData,
  storedUserID,
  tagListArray,
  video_data,
  view,
} from '@app/constants/constants';
import {theme} from '@app/constants';
import {EventRegister} from 'react-native-event-listeners';
import Banner from '@app/components/cards/banner';
import {sessionTimeout} from '@app/constants/errorCodes';
import PollCard from '@app/components/cards/pollCard';
import {
  addEventForTracking,
  checkVisitorData,
} from '@app/services/tracking/rpiServices';
import StorageService from '@app/utils/storageService';
import RetailHomeCard from '@app/components/cards/retailHomeCard';
import {icons} from '@app/assets/icons';
import {useAppContext} from '@app/store/appContext';
import ScreenNames from '@app/constants/screenNames';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import BackgroundFetch from 'react-native-background-fetch';
import {
  isToday,
  scheduleLiveEventNotification,
  scheduleRecommendationNotification,
  scheduleReminderNotification,
  storeRecommendationList,
} from '@app/utils/notificationsHelper';
import {showSessionExpiredAlert} from '@app/services/sessionExpiredService';
import CardTypes from '@app/components/cards/cardTypes';
import NotificationPopup from '@app/components/Popup/NotificationPopup';
import getMyStoriesData from '@app/services/myStoriesService';
import {SiteSettings} from '@app/model/globalSetting';
import getGlobalSettings from '@app/services/globalSetting';
import {MyStory} from '@app/model/myStories';
import SpinWheel from '@app/components/UserOLProfile/SpinWheel';

const HomeScreen: React.FC = () => {
  const {appConfigData} = useAppContext();
  const flatListRef = useRef<FlatList<any> | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isCustomEventListenerAdded, setIsCustomEventListenerAdded] =
    useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [data, setData] = useState<(Content | Content[])[]>([]);
  const [globalData, setGlobalData] = useState<SiteSettings | null>(null);
  const [tagListData, setTagListData] = useState<MyStory[]>([]);
  const [spinWheelData, setSpinWheelData] = useState<MyStory[]>([]);
  const [wheelVisible, setWheelVisible] = useState<boolean>(false);
  const [contentPaginationStartIndex, setcontentPaginationStartIndex] =
    useState(0);
  const [totalRecords, setTotalRecord] = useState(Number.MAX_VALUE);
  const [loadingNewData, setLoadingNewData] = useState(false);
  const [isLiveNotificationTriggered, setNotificationTrigger] = useState(false);
  const [isVisible, setNotificationPopup] = useState(false);
  const [contentType, setContentType] = useState('');
  const [notificationContent, setNotificationContent] = useState({
    title: '',
    message: '',
    time: '',
    data: {},
    isEventLive: false,
    isEventExpired: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const pageSize = 20;

  const onRefresh = () => {
    setcontentPaginationStartIndex(0);
    setRefreshing(true);
    if (flatListRef.current !== null) {
      flatListRef.current.scrollToOffset({animated: true, offset: 0});
    }
  };

  const closeAlert = () => {
    setNotificationPopup(false);
  };

  useEffect(() => {
    const appViewTracking = async () => {
      const data = {ContentType: ScreenNames.homeScreen, screenType: view};
      await addEventForTracking(data);
    };
    appViewTracking();
  }, []);

  const onClickScheduleTask = (appState: any) => {
    BackgroundFetch.scheduleTask({
      taskId: 'HCLSportsTemplate.com.fetch',
      delay: 5000,
      forceAlarmManager: true,
    })
      .then(() => {
        recommendContent(appState);
        checkWatchedStatus(appState);
        const filtered_Data = data?.find(
          (item: any) =>
            item?.ContentType === CardType.EventDetails &&
            isToday(item?.EventStartDate),
        );
        if (filtered_Data !== undefined && !isLiveNotificationTriggered) {
          calculateTimeLeft(filtered_Data, appState);
        }
      })
      .catch(error => {
        console.log('scheduleTask ERROR', error);
      });
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState: any) => {
      setAppState(prevAppState => {
        if (
          prevAppState.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          console.log('App has come to the foreground!');
        } else if (nextAppState.match(/inactive|background/)) {
          onClickScheduleTask(nextAppState);
        }
        return nextAppState; // return the updated state
      });
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, []);

  const handleCustomEvent = () => {
    onRefresh();
  };

  useEffect(() => {
    if (refreshing && contentPaginationStartIndex === 0) {
      getData({showLoader: !refreshing});
    }
  }, [refreshing, contentPaginationStartIndex]);

  useEffect(() => {
    const addCustomEventListener = () => {
      if (!isCustomEventListenerAdded) {
        EventRegister.addEventListener(refreshScreenData, handleCustomEvent);
        setIsCustomEventListenerAdded(true);
      }
    };

    const removeCustomEventListener = () => {
      EventRegister.removeEventListener(refreshScreenData);
      setIsCustomEventListenerAdded(false);
    };

    addCustomEventListener();

    return () => {
      removeCustomEventListener();
    };
  }, []);

  const checkWatchedStatus = async (appState: any) => {
    try {
      const storedVideoData = await StorageService.getData(video_data);
      let videoData = storedVideoData ? JSON.parse(storedVideoData) : [];
      if (
        videoData !== null &&
        !videoData.isWatched &&
        videoData?.data?.title != undefined
      ) {
        const videoId = videoData.id;
        const videoContent = videoData.data;
        let eventTitle = `You were watching ${videoContent?.title}.`;
        let eventSubtitle = `Want to finish it?`;
        if (appState !== 'active') {
          scheduleReminderNotification(videoContent, eventTitle, eventSubtitle);
          await StorageService.storeData(
            video_data,
            JSON.stringify({
              isWatched: true,
              Id: videoId,
              data: videoContent,
              remainingTIme: 0,
            }),
          );
        } else {
          setTimeout(async () => {
            setNotificationContent({
              title: eventTitle,
              message: eventSubtitle,
              time: new Date()?.toString(),
              data: videoData,
              isEventLive: false,
              isEventExpired: false,
            });
            setContentType(CardType.Video);
            setNotificationPopup(true);
            await StorageService.storeData(
              video_data,
              JSON.stringify({
                isWatched: true,
                Id: videoId,
                data: videoContent,
                remainingTIme: 0,
              }),
            );
          }, 30000);
        }
      }
    } catch (error) {
      console.error('Error retrieving video data:', error);
    }
  };

  useEffect(() => {
    getData({showLoader: true});
    recommendContent(appState);
    checkWatchedStatus(appState);
  }, []);

  useEffect(() => {
    getSpinWheelData();
    const timer = setTimeout(() => {
      setWheelVisible(true);
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const calculateTimeLeft = (pushNotificationData: any, appState: any) => {
    const currentDate = new Date();
    const eventDateTime = new Date(pushNotificationData?.EventStartDate);
    const timeDifference: number =
      eventDateTime.getTime() - currentDate.getTime();
    const minutesDifference: number = Math.floor(timeDifference / (1000 * 60));
    let eventTitle = pushNotificationData.Title;
    let eventSubtitle = 'Your live event will start in 5 minutes!';
    if (minutesDifference == 5 && appState !== 'active') {
      scheduleLiveEventNotification(pushNotificationData);
      setNotificationTrigger(true);
    } else if (minutesDifference == 5 && appState === 'active') {
      setNotificationContent({
        title: eventTitle,
        message: eventSubtitle,
        time: pushNotificationData?.EventStartDate,
        data: pushNotificationData,
        isEventLive: false,
        isEventExpired: false,
      });
      setNotificationTrigger(true);
      setContentType(pushNotificationData.ContentType);
      setNotificationPopup(true);
    } else if (minutesDifference == 0 && appState === 'active') {
      eventSubtitle = 'Event is Live!';
      setNotificationContent({
        title: eventSubtitle,
        message: eventTitle,
        time: pushNotificationData?.EventStartDate,
        data: pushNotificationData,
        isEventLive: true,
        isEventExpired: false,
      });
      setNotificationTrigger(true);
      setContentType(pushNotificationData.ContentType);
      setNotificationPopup(true);
    }
  };

  useEffect(() => {
    // Set up the interval
    const interval = setInterval(() => {
      if (isLiveNotificationTriggered) {
        clearInterval(interval);
        return;
      }
      const filtered_Data = data?.find(
        (item: any) =>
          item?.ContentType === CardType.EventDetails &&
          isToday(item?.EventStartDate),
      );
      if (filtered_Data !== undefined && !isLiveNotificationTriggered) {
        calculateTimeLeft(filtered_Data, appState);
      }
    }, 10000); // 10000ms = 10 seconds

    return () => clearInterval(interval);
  }, [data, isLiveNotificationTriggered]);

  const updateData = () => {
    if (!loadingNewData) {
      setLoadingNewData(true);
      getData({showLoader: false});
    }
  };

  async function checkVisitorID() {
    try {
      const userID = await StorageService.getData(storedUserID);
      const contents = await checkVisitorData(userID ?? '');

      if (contents.Values.length > 0) {
        const tagsObject = contents.Values.find(obj => obj.Name === 'tags');
        let tagsArray: string[] = [];
        if (tagsObject && tagsObject.Value) {
          tagsArray = tagsObject.Value.split(',').map(tag => tag.trim());
        }
        console.log(tagsArray);
        await StorageService.clearData(tagListArray);
        await StorageService.storeData(tagListArray, JSON.stringify(tagsArray));
      }
    } catch (err: any) {
      console.log(err.message);
      return {} as any;
    }
  }

  async function getGlobalSettingsData() {
    try {
      const pagePath = 'global-item';
      const contents = await getGlobalSettings(pagePath);
      if ('data' in contents && contents?.data?.publish_fetchSiteSettings) {
        const settingData = contents?.data?.publish_fetchSiteSettings;
        console.log('Setting data ==>', settingData);
        setGlobalData(settingData);
        await StorageService.clearData(globalSettingData);
        await StorageService.storeData(
          globalSettingData,
          JSON.stringify(settingData),
        );
      }
    } catch (err: any) {
      console.log(err.message);
      return {} as any;
    }
  }

  async function getTagListData() {
    try {
      await getGlobalSettingsData();

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
          Object?.values(CardType)?.includes(item?.ContentType),
        );
        setTagListData(tagsData);
      }
    } catch (err: any) {
      console.log(err.message);
    }
  }

  const getSpinWheelData = async () => {
    try {
      const pagination = {start: 0, rows: 1};
      const searchTerm = '';
      const tags = ['Wheel'];
      const cdpFilter = ['Home'];
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
        console.log('spin wheel data ==>', newData);
        setSpinWheelData(newData);
      }
    } catch (err: any) {
      console.log(err.message);
    }
  };

  async function getData(options: {showLoader: boolean}) {
    const {showLoader} = options;
    setIsError(null);

    try {
      if (showLoader) {
        setIsLoading(true); // Show loading indicator
        setIsError(null); // Reset the error message
      }

      if (data.length === 0 || refreshing) {
        await checkVisitorID();
        await getTagListData();
      }

      const pagination = {start: contentPaginationStartIndex, rows: pageSize};
      const searchTerm = '';
      const tags: string[] = [];
      const filter = 'ALL';

      // Call the fetchGraphQLData function with input parameters
      const contents = await getHomeScreenData(
        pagination,
        searchTerm,
        tags,
        filter,
      );

      if ('data' in contents && contents?.data?.publish_getContents?.records) {
        const newData = contents?.data?.publish_getContents?.records;
        const filtered_Data = newData?.filter((item: any) =>
          Object?.values(CardType)?.includes(item?.ContentType),
        );

        if (data.length === 0 || refreshing) {
          const homeScreenData = filtered_Data;
          setData(homeScreenData);
        } else {
          setData([...data, ...filtered_Data]);
        }
        setcontentPaginationStartIndex(contentPaginationStartIndex + pageSize);
        setLoadingNewData(false);

        console.log(
          'Total Records',
          contents?.data?.publish_getContents?.total_records,
        );

        const total = contents?.data?.publish_getContents?.total_records;
        if (total !== totalRecords) {
          setTotalRecord(total);
        }
        setIsLoading(false); // Hide loading indicator when the service call is complete
      } else if ('data' in contents && contents?.errors[0]) {
        showSessionExpiredAlert();
        console.log('Error', contents?.errors[0]?.message);
      } else {
        setIsError('Something went wrong!!!!'); // Set the error message
      }
      if (refreshing) {
        setRefreshing(false);
      }
    } catch (err: any) {
      console.log(err.message);
      if (refreshing) {
        setRefreshing(false);
      }
      if (err.message !== sessionTimeout) {
        setIsError('Something went wrong!!!!'); // Set the error message
      }
    }
  }

  const handleRetry = () => {
    getData({showLoader: true});
  };

  const renderListHeader = () => {
    if (globalData?.disable_my_stories) {
      return (
        <Carousels type={CarouselTypes.Favourite} carouselData={tagListData} />
      );
    } else {
      return null;
    }
  };

  const styles = StyleSheet.create({
    contentContainer: {
      gap: theme.cardMargin.left,
      marginTop: theme.cardMargin.left,
      paddingBottom: theme.cardMargin.left * 2,
    },
    container: {
      paddingTop: 1,
      flex: 1,
    },
    loading: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 8,
      margin: 10,
    },
    headingText: {
      paddingLeft: theme.cardMargin.left, // Adjust the left padding to offset the initial item
      paddingBottom: 20,
      paddingTop: 40,
      color: appConfigData?.secondary_text_color,
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font16,
    },
    headingView: {
      paddingTop: 33,
      paddingBottom: 20,
      backgroundColor: appConfigData?.background_color,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: theme.cardMargin.left,
    },
    text: {
      fontFamily: theme.fonts.DMSans.bold,
      fontSize: theme.fontSize.font24,
      color: appConfigData?.secondary_text_color,
    },
  });

  const handleFilterIconPress = () => {
    navigation?.navigate(ScreenNames.onboardingSecondScreen, {
      searchTerm: true,
    });
  };

  const recommendContent = async (appState: any) => {
    try {
      const recommandItemList = await StorageService.getData(
        'recommandItemList',
      );
      let recommandItemListItem = recommandItemList
        ? JSON.parse(recommandItemList)
        : [];
      let recommendedContent;
      if (
        recommandItemListItem.data?.ContentType !== undefined &&
        !recommandItemListItem.isWatched
      ) {
        const contentType = recommandItemListItem.data?.ContentType;
        let articlePrefix = 'a';

        if (
          contentType === CardType.Article ||
          contentType === CardType.EventDetails
        ) {
          articlePrefix = 'an';
        }

        recommendedContent = `${articlePrefix} ${contentType} is Published. Author ${recommandItemListItem.data?.Author}`;
        const eventTitle = 'You may like this!';
        const eventSubtitle = `Based on your interest, check out: "${recommendedContent}"`;
        if (appState !== 'active') {
          scheduleRecommendationNotification(
            recommandItemListItem,
            eventTitle,
            eventSubtitle,
          );
          storeRecommendationList(recommandItemListItem);
        } else {
          setTimeout(() => {
            setNotificationContent({
              title: eventTitle,
              message: eventSubtitle,
              time: recommandItemListItem?.data?.PublishedDate,
              data: recommandItemListItem,
              isEventLive: false,
              isEventExpired: true,
            });
            setContentType(contentType);
            setNotificationPopup(true);
            storeRecommendationList(recommandItemListItem);
          }, 30000);
        }
      }
    } catch (e) {
      console.error('Failed to generate recommendation.', e);
    }
  };

  return isLoading ? (
    <LoadingScreen
      isLoading={isLoading}
      error={isError}
      onRetry={handleRetry}
    />
  ) : (
    <View style={styles.container}>
      <View style={styles.headingView}>
        <Text style={styles.text}>Discover</Text>
        <TouchableOpacity activeOpacity={1} onPress={handleFilterIconPress}>
          <Image source={icons.ListIcon} />
        </TouchableOpacity>
      </View>
      <FlatList
        ref={flatListRef}
        data={data}
        onEndReached={
          contentPaginationStartIndex > 0 &&
          contentPaginationStartIndex < totalRecords
            ? updateData
            : null
        }
        initialNumToRender={5}
        windowSize={9}
        scrollEventThrottle={200}
        keyExtractor={(item, index) => `${item.Id}${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        renderItem={({item}) => <>{renderItem(item, [])}</>}
        ListHeaderComponent={renderListHeader()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="gray"
          />
        }
      />
      {loadingNewData && (
        <View style={[styles.container, styles.loading]}>
          <ActivityIndicator size="small" />
        </View>
      )}

      {contentType !== CardTypes.Quiz && (
        <NotificationPopup
          visible={isVisible}
          contentType={contentType}
          notificationContent={notificationContent}
          onClose={closeAlert}
          multipleItem={false}
        />
      )}
      {wheelVisible && spinWheelData?.length !== 0 && (
        <SpinWheel
          data={spinWheelData[0]}
          visible={wheelVisible}
          onClose={() => setWheelVisible(false)}
        />
      )}
    </View>
  );
};

const renderItem = (item: any, recentItems: (Content | any)[]) => {
  if (Array.isArray(item)) {
    return <Carousels type={CarouselTypes.Home} carouselData={item} />;
  } else {
    if (item.ContentType === CardType.Banner) {
      return <Banner data={item} />;
    } else if (item.ContentType === CardType.Poll) {
      return <PollCard data={item} />;
    }
    return <RetailHomeCard data={item} recentItems={recentItems} />;
  }
};

export default HomeScreen;
