/* eslint-disable react/react-in-jsx-scope */
import {icons} from '@app/assets/icons';
import {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import EventCardImage from '@app/components/EventCard/EventCardImage';
import SafeAreaUtils from '@app/utils/safeAreaUtils';
import EventCardTagContainer from '@app/components/EventCard/EventCardTagContainer';
import EventCardFeed from '@app/components/EventCard/EventCardFeed';
import EventCardDetails from '@app/components/EventCard/EventCardDetails';
import ArticleCardDescription from '@app/components/ArticleCard/ArticleCardDescription';
import ArticleCardAuthor from '@app/components/ArticleCard/ArticleCardAuthor';
import LoadingScreen from '../loadingScreen/loadingScreen';
import getEventBlogScreenData from '@app/services/contentType/eventBlogs';
import {EventDetail} from '@app/model/contentType/eventDetail';
import {BlogEntry} from '@app/model/contentType/eventBlogs';
import BasicHeader from '@app/components/ui-components/basicHeader';
import CardTypes from '@app/components/cards/cardTypes';
import {sessionTimeout} from '@app/constants/errorCodes';
import {loadImage} from '@app/utils/imageLinkUtils';
import providePoints from '@app/services/openLoyalty/loyaltyPoint';
import {addEventForTracking} from '@app/services/tracking/rpiServices';
import {view} from '@app/constants/constants';
import FastImage from 'react-native-fast-image';
import getContentDetail from '@app/services/contentType/contentDetail';
import React from 'react';

const EventDetails: React.FC = ({route}: any) => {
  const [eventResponse, setEventResponse] = useState<EventDetail | null>(null);
  const [pageUrl, setPageUrl] = useState<string>('');
  const [blogData, setBlogData] = useState<(BlogEntry | BlogEntry[])[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loadingNewData, setLoadingNewData] = useState(false);
  const [loadingBlogNewData, setLoadingBlogNewData] = useState(false);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isEndReached, setIsEndReached] = useState<boolean>(false);
  const [contentPaginationStartIndex, setcontentPaginationStartIndex] =
    useState(0);

  const pageSize = 3;

  const dimensions = Dimensions.get('window');
  const imageWidth = dimensions.width;
  const imageHeight = dimensions.height;
  const scrollViewRef = useRef<ScrollView>(null);
  const safeAreaTopInset = SafeAreaUtils.getSafeAreaInsets().top;
  const {data} = route.params;

  const updateData = () => {
    if (hasMoreData && !loadingNewData) {
      setLoadingBlogNewData(true);
      getBlogData();
      setLoadingBlogNewData(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    getData({showLoader: true});
    setRefreshing(false);
  };

  const arrowClicked = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: imageHeight - (safeAreaTopInset + 30),
        animated: true,
      });
    }
  };
  const defaultImage =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIoAAACKCAMAAABCWSJWAAAAUVBMVEXd3d3g4ODNzc3j4+M7Ozupqal7e3vR0dGLi4tdXV3o6Ohvb2/W1tZsbGycnJxKSkqSkpIAAACxsbF1dXU2NjbHx8dRUVEgICARERG+vr64uLiybrQAAAAAzUlEQVR4nO3WSRKCMBBA0Qw2kTYDGnG6/0GNLpAbtIv/FlSxyq8UaeIcAAAAAAAAAAAAAAAw5TfWIamcvnp5ReOUcF3qcGxLFdsWHw45DqG5OmfrlOS882tLms7J8nv5pGivcW05+tQvhi3flHnRtVURuYl1yiQx9FLKqVmnbMv72Trl90LKPiV//EWKyvn+mNTbp4zDPPblMqdonhLlOeZtkGy+K1lVx19oPNU45Xr8sR1xuU87L9P7U9yzvskBAAAAAAAAAAAAAAD8tzdQYAdOgzoIUQAAAABJRU5ErkJggg==';
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);

  const eventData = data;

  useEffect(() => {
    getData({showLoader: true});
    const appViewTracking = async () => {
      const data = {
        screenType: view,
        content_type: CardTypes.EventDetails,
        contentData: eventData,
      };
      await addEventForTracking(data);
    };
    appViewTracking();
  }, []);

  async function getData(options: {showLoader: boolean}) {
    const {showLoader} = options;

    try {
      if (showLoader) {
        setIsLoading(true);
        setIsError(null);
      }

      const type = 'Event';
      const contents = await getContentDetail(data.Id as any, type);

      if ('data' in contents && contents?.data?.publish_contentDetail) {
        setEventResponse(contents?.data?.publish_contentDetail);
        const portraitImage =
          contents?.data?.publish_contentDetail?.original_image
            ?.original_image_relative_path;
        const ext =
          contents?.data?.publish_contentDetail?.original_image?.ext || '';
        let bannerURL = defaultImage;
        if (portraitImage) {
          bannerURL = loadImage(portraitImage, ext);
          FastImage.preload([{uri: bannerURL}]);
          setImageUrl(bannerURL);
        }
        setPageUrl(contents?.data?.publish_contentDetail?.current_page_url);
        setIsLoading(false);
        getBlogData();
        await providePoints(data?.Id ?? '');
      } else {
        setIsError('Something went wrong!!!!');
      }
    } catch (err: any) {
      console.log(err.message);

      if (err.message !== sessionTimeout) {
        setIsError('Something went wrong!!!!'); // Set the error message
      }
    }
  }

  async function getBlogData() {
    try {
      setLoadingNewData(true);
      const pagination = {start: contentPaginationStartIndex, rows: pageSize};

      const contents = await getEventBlogScreenData(data.Id, pagination);

      if ('data' in contents && contents.data) {
        if (contents?.data?.publish_fetchblog?.response.result.length == 0) {
          setHasMoreData(false);
        } else {
          const newBlogData =
            contents?.data?.publish_fetchblog?.response?.result;
          setBlogData([...blogData, ...newBlogData]);
          console.log('Blog Data length: ', blogData.length);
        }
        setcontentPaginationStartIndex(contentPaginationStartIndex + 1);
      }
    } catch (err: any) {
      if (err.message !== sessionTimeout) {
        setIsError('Something went wrong!!!!'); // Set the error message
      }
    } finally {
      setLoadingNewData(false);
    }
  }

  const handleScroll = (event: any) => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const paddingToBottom = 20; // Adjust as needed
    const isEnd =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
    if (isEnd && !isEndReached) {
      setIsEndReached(true);
      console.log('End of ScrollView reached!');
      updateData();
    } else if (!isEnd && isEndReached) {
      setIsEndReached(false);
    }
  };

  const handleRetry = () => {
    getData({showLoader: true});
  };

  return isLoading ? (
    <>
      <LoadingScreen
        isLoading={isLoading}
        error={isError}
        onRetry={handleRetry}
      />
      <BasicHeader
        id={eventResponse?.current_page_url ?? ''}
        contentType={CardTypes.EventDetails.toString()}
        url={pageUrl}
      />
    </>
  ) : (
    <>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="gray"
          />
        }>
        <EventCardImage
          imageHeight={imageHeight}
          imageWidth={imageWidth}
          eventImage={imageUrl ?? defaultImage}
          eventDuration={eventResponse?.event_start_date ?? ''}
          eventTitle={eventResponse?.title ?? ''}
          icon={icons.articleScroll}
          arrowPressed={arrowClicked}
        />
        <EventCardTagContainer
          eventTags={eventResponse?.settings?.keywords ?? []}
        />
        <ArticleCardDescription
          description={eventResponse?.description ?? ''}
        />
        <ArticleCardAuthor
          name={eventResponse?.last_modified_by ?? ''}
          datePosted={eventResponse?.last_modification_date}
        />
        <EventCardDetails
          eventStartDateTime={eventResponse?.event_start_date ?? ''}
          eventEndDateTime={eventResponse?.event_end_date ?? ''}
          eventLink={eventResponse?.virtual_address ?? ''}
          eventLocation={eventResponse?.actual_address ?? ''}
        />
        {blogData.length !== 0 && <EventCardFeed data={blogData ?? []} />}
      </ScrollView>
      {loadingBlogNewData && (
        <View style={[styles.container, styles.loading]}>
          <ActivityIndicator size="small" />
        </View>
      )}
      <BasicHeader
        id={data.Id}
        contentType={CardTypes.EventDetails.toString()}
        url={pageUrl}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: '100%',
    paddingBottom: 40,
  },
  loading: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    margin: 10,
  },
});

export default EventDetails;
