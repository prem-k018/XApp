/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Reel from '@app/components/reels/reel';
import {useNavigation} from '@react-navigation/native';
import {FlatList, StyleSheet, View} from 'react-native';
import BackButton from '@app/components/ui-components/backButton';
import LoadingScreen from '../loadingScreen/loadingScreen';
import {useSafeAreaFrame} from 'react-native-safe-area-context';
import CardTypes from '@app/components/cards/cardTypes';
import {sessionTimeout} from '@app/constants/errorCodes';
import {view} from '@app/constants/constants';
import {addEventForTracking} from '@app/services/tracking/rpiServices';
import getContentDetail from '@app/services/contentType/contentDetail';

type ReelProps = {
  id: string;
  type: string;
  uri: string;
  title: string;
  author: string;
  page_url: string;
  tagName: string;
  tags: any;
};

const renderItem = (
  item: ReelProps,
  index: number,
  currIndex: number,
  nextReelFn: () => void,
  prevReelFn: () => void,
  reelItems: any,
) => {
  return index === currIndex ? (
    <Reel
      id={item.id}
      type={item.type}
      uri={item.uri}
      title={item.title}
      currIndex={currIndex}
      thisIndex={index}
      nextReelFn={nextReelFn}
      prevReelFn={prevReelFn}
      content={reelItems}
    />
  ) : (
    <></>
  );
};

const ReelsScreens: React.FC = ({route}: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [reelItems, setReelItems] = useState<ReelProps[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [currReel, setCurrReel] = useState<number>(0);
  const flatListRef = useRef<FlatList>(null);

  const safeFrame = useSafeAreaFrame();

  const {data, recentItems} = route.params;

  const reelData = data;

  useEffect(() => {
    getData({showLoader: true});
    const appViewTracking = async () => {
      const data = {
        screenType: view,
        content_type: 'Video',
        contentData: reelData,
      };
      await addEventForTracking(data);
    };
    appViewTracking();
  }, []);

  async function getData(options: {showLoader: boolean}) {
    const {showLoader} = options;

    try {
      if (showLoader) {
        setIsLoading(true); // Show loading indicator
        setIsError(null); // Reset the error message
      }

      /** How many items are added to the reel beyond just the selected item.
      Note this is dependent on how many recentItems were provided from homeScreen.
      Let instead of const to allow it to be increased for related videos*/
      let max_items = 5;
      const reels: ReelProps[] = [];

      if (recentItems) {
        const temporaryRecentItems = JSON.parse(JSON.stringify(recentItems));
        temporaryRecentItems.splice(0, 0, data);
        let i = 0;

        while (
          i < temporaryRecentItems.length &&
          reels.length < max_items + 1
        ) {
          const currItem = temporaryRecentItems[i];
          if (i !== 0 && data.Id === currItem.Id) {
            i++;
            continue;
          }
          if (currItem.ContentType === CardTypes.Video) {
            const type = 'VOD';
            const contents = await getContentDetail(currItem.Id as any, type);
            if ('data' in contents && contents?.data?.publish_contentDetail) {
              reels.push({
                id: contents?.data?.publish_contentDetail?.page,
                type: CardTypes.Video,
                uri: contents?.data?.publish_contentDetail?.DsapceVideoUrl,
                title: contents?.data?.publish_contentDetail?.title,
                author: contents?.data?.publish_contentDetail?.author,
                page_url:
                  contents?.data?.publish_contentDetail?.current_page_url,
                tagName: contents?.data?.publish_contentDetail?.tag_name,
                tags: contents?.data?.publish_contentDetail?.tags,
              });
              // Add all latest VODs to reel array
              contents?.data?.publish_contentDetail?.LatestVods.map(
                (vod: any) => {
                  reels.push({
                    id: vod.Page,
                    type: CardTypes.Video,
                    uri: vod.DsapceVideoUrl,
                    title: vod.title,
                    author: vod.author,
                    page_url: vod.current_page_url,
                    tagName: vod.TagName,
                    tags: vod.tags,
                  });
                },
              );
              max_items +=
                contents?.data.publish_contentDetail?.LatestVods.length;
            } else {
              setIsError('Something went wrong!!!!'); // Set the error message
            }
          } else {
            reels.push({
              id: currItem.Id,
              type: currItem.ContentType,
              uri: currItem.Id,
              title: currItem.Title,
              author: currItem.author,
              page_url: currItem.current_page_url,
              tagName: currItem.tag_name,
              tags: currItem.tags,
            });
          }
          i++;
        }
      } else {
        const type = 'VOD';
        const contents = await getContentDetail(data.Id as any, type);
        if ('data' in contents && contents?.data.publish_contentDetail) {
          reels.push({
            id: contents?.data?.publish_contentDetail?.page,
            type: CardTypes.Video,
            uri: contents?.data?.publish_contentDetail?.DsapceVideoUrl,
            title: contents?.data?.publish_contentDetail?.title,
            author: contents?.data?.publish_contentDetail?.author,
            page_url: contents?.data?.publish_contentDetail?.current_page_url,
            tagName: contents?.data?.publish_contentDetail?.tag_name,
            tags: contents?.data?.publish_contentDetail?.tags,
          });
          // Add all latest VODs tot reel array
          contents?.data?.publish_contentDetail?.LatestVods.map((vod: any) => {
            reels.push({
              id: vod.Page,
              type: CardTypes.Video,
              uri: vod.DsapceVideoUrl,
              title: vod.title,
              author: vod.author,
              page_url: vod.current_page_url,
              tagName: vod.TagName,
              tags: vod.tags,
            });
          });
          max_items += contents?.data.publish_contentDetail?.LatestVods.length;
        } else {
          setIsError('Something went wrong!!!!'); // Set the error message
        }
      }

      setReelItems(reels);
      setIsLoading(false); // Hide loading indicator when the service call is complete
    } catch (err: any) {
      console.log(err.message);

      if (err.message !== sessionTimeout) {
        setIsError('Something went wrong!!!!'); // Set the error message
      }
    }
  }

  const handleRetry = () => {
    getData({showLoader: true});
  };

  const scroll = (index: number): void => {
    if (index >= 0 && index < reelItems.length) {
      setCurrReel(index);
      flatListRef?.current?.scrollToIndex({animated: true, index: index});
    }
  };

  const nextReelFn = () => {
    scroll(currReel + 1);
  };

  const prevReelFn = () => {
    scroll(currReel - 1);
  };

  return isLoading ? (
    <View style={styles.container}>
      <LoadingScreen
        isLoading={isLoading}
        error={isError}
        onRetry={handleRetry}
      />
      <BackButton onPress={() => navigation?.goBack()} />
    </View>
  ) : (
    <View>
      <FlatList
        ref={flatListRef}
        data={reelItems}
        getItemLayout={(_data, index) => ({
          length: safeFrame.height,
          offset: safeFrame.height * index,
          index,
        })}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        keyExtractor={(item, index) => `${item.id}${index}`}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        renderItem={({item, index}) =>
          renderItem(item, index, currReel, nextReelFn, prevReelFn, reelItems)
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ReelsScreens;
