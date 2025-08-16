/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, View} from 'react-native';
import {useSafeAreaFrame} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Story from '@app/components/stories/story';
import {Content} from '@app/model/content';
import StoryBar from '@app/components/stories/storyBar';
import {theme} from '@app/constants';
import {addEventForTracking} from '@app/services/tracking/rpiServices';
import ScreenNames from '@app/constants/screenNames';
import {view} from '@app/constants/constants';

type StoryProgressType = {
  progress: number;
  progressTotal: number;
  customUpdate: boolean;
};

const renderItem = (
  item: Content,
  index: number,
  currIndex: number,
  nextStoryFn: () => void,
  prevStoryFn: () => void,
  stopStoryAutoScroll: () => void,
  setCustomUpdate: (custom: boolean) => void,
  customProgressUpdate: (progress: number, total: number) => void,
) => {
  return (
    <Story
      id={item.Id}
      item={item}
      currIndex={currIndex}
      thisIndex={index}
      nextStoryFn={nextStoryFn}
      prevStoryFn={prevStoryFn}
      stopStoryAutoScroll={stopStoryAutoScroll}
      setCustomUpdate={setCustomUpdate}
      customProgressUpdate={customProgressUpdate}
    />
  );
};

const StoriesScreens: React.FC = ({route}: any) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const safeFrame = useSafeAreaFrame();
  const {stories, currStoryIndex} = route.params;

  const STORY_UPDATE_INTERVAL_MILLISECONDS = 250;
  const STORY_DURATION_MILLISECONDS = 20 * STORY_UPDATE_INTERVAL_MILLISECONDS;

  const flatListRef = useRef<any>();
  const [currStory, setCurrStory] = useState<number>(-1);

  const [storyProgress, setStoryProgress] = useState<StoryProgressType>({
    progress: 0,
    progressTotal: STORY_DURATION_MILLISECONDS,
    customUpdate: false,
  });
  const storyUpdateInterval = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const appViewTracking = async () => {
      const data = {ContentType: ScreenNames.storiesScreen,screenType:view};
      await addEventForTracking(data);
    };
    appViewTracking();
  },[]);
  const setCustomUpdate = (custom: boolean) => {
    if (custom) {
      clearInterval(storyUpdateInterval.current ?? undefined);
      setStoryProgress({
        progress: 0,
        progressTotal: Number.MAX_SAFE_INTEGER,
        customUpdate: custom,
      });
    } else {
      resetInterval();
    }
  };

  const customProgressUpdate = (progress: number, total: number) => {
    setStoryProgress(prevProgress => {
      if (prevProgress.customUpdate) {
        return {
          progress: progress,
          progressTotal: total,
          customUpdate: prevProgress.customUpdate,
        };
      } else {
        return prevProgress;
      }
    });
  };

  const stopInterval = () => {
    clearInterval(storyUpdateInterval.current ?? undefined);
  };

  const startIntervalFromCurrentProgress = () => {
    storyUpdateInterval.current = setInterval(
      countDown,
      STORY_UPDATE_INTERVAL_MILLISECONDS,
    );
  };

  const resetInterval = () => {
    clearInterval(storyUpdateInterval.current ?? undefined);
    setStoryProgress({
      progress: 0,
      progressTotal: STORY_DURATION_MILLISECONDS,
      customUpdate: false,
    });
    storyUpdateInterval.current = setInterval(
      countDown,
      STORY_UPDATE_INTERVAL_MILLISECONDS,
    );
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      stopInterval();
    });

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      startIntervalFromCurrentProgress();
    });

    return unsubscribe;
  }, [navigation]);

  const scroll = (index: number): void => {
    if (index >= 0 && index < stories.length && flatListRef.current !== null) {
      resetInterval();
      setCurrStory(index);
      flatListRef.current.scrollToIndex({animated: true, index: index});
    }
  };

  const autoscrollToNext = (): void => {
    setCurrStory(currValue => {
      if (currValue >= 0 && currValue < stories.length - 1) {
        resetInterval();
        flatListRef.current.scrollToIndex({
          animated: true,
          index: currValue + 1,
        });
        return currValue + 1;
      } else {
        navigation.goBack();
        stopInterval();
        return currValue;
      }
    });
  };

  const countDown = () => {
    setStoryProgress(prevProgress => {
      const newProgress = {
        progress: prevProgress.progress + STORY_UPDATE_INTERVAL_MILLISECONDS,
        progressTotal: prevProgress.progressTotal,
        customUpdate: prevProgress.customUpdate,
      };
      if (newProgress.progress >= newProgress.progressTotal) {
        autoscrollToNext();
        // Technically resetting story progress again after it's already reset
        //  in autoscroll's resetInterval call. Could be improved if we can break out of
        //  the setState call without updating the state.
        newProgress.progress = 0;
        newProgress.progressTotal = STORY_DURATION_MILLISECONDS;
        newProgress.customUpdate = false;
      }
      return newProgress;
    });
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={stories}
        onLayout={event => {
          if (currStory === -1) {
            scroll(currStoryIndex);
          }
        }}
        getItemLayout={(_data, index) => ({
          length: safeFrame.width,
          offset: safeFrame.width * index,
          index,
        })}
        horizontal={true}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        keyExtractor={item => item.Id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        renderItem={({item, index}) =>
          renderItem(
            item,
            index,
            currStory,
            () => {
              if (currStory === stories.length - 1) {
                navigation.goBack();
              }
              scroll(currStory + 1);
              scroll(currStory + 1);
            },
            () => {
              if (currStory === 0) {
                navigation.goBack();
              }
              scroll(currStory + 1);
              scroll(currStory - 1);
            },
            stopInterval,
            setCustomUpdate,
            customProgressUpdate,
          )
        }
      />
      {/* Loading screen, to replace with something better as the story loads up */}
      {currStory === -1 && (
        <View
          style={{
            position: 'absolute',
            width: safeFrame.width,
            height: safeFrame.height,
            backgroundColor: theme.colors.fullBlack,
          }}
        />
      )}

      <StoryBar
        index={currStory}
        total={stories.length}
        thisStoryProgress={storyProgress.progress}
        thisStoryProgressTotal={storyProgress.progressTotal}
        maxStoryBarWidth={safeFrame.width}
        storyIntervalRef={storyUpdateInterval}
      />
    </View>
  );
};

export default StoriesScreens;
