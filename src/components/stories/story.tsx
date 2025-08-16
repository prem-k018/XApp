import {Content} from '@app/model/content';
import React from 'react';
import {View, Pressable, GestureResponderEvent} from 'react-native';
import {useSafeAreaFrame} from 'react-native-safe-area-context';
import ArticleStory from './articleStory';
import CardTypes from '../cards/cardTypes';
import Poll from '@app/screens/poll/poll';
import Quiz from '@app/screens/quiz/quiz';
import VideoStory from './videoStory';
import DefaultStory from './defaultStory';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import ScreenNames from '@app/constants/screenNames';

type StoryProps = {
  id: string;
  item: Content;
  currIndex: number;
  thisIndex: number;
  nextStoryFn: () => void;
  prevStoryFn: () => void;
  stopStoryAutoScroll: () => void;
  setCustomUpdate: (custom: boolean) => void;
  customProgressUpdate: (progress: number, total: number) => void;
};

const Story = (props: StoryProps) => {
  const safeFrame = useSafeAreaFrame();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handlePress = ({nativeEvent}: GestureResponderEvent) => {
    console.log('Pressable event handling ' + nativeEvent.pageX);
    if (nativeEvent.pageX < safeFrame.width / 3) {
      console.log('tap left!');
      props.prevStoryFn();
    } else if (nativeEvent.pageX > (2 * safeFrame.width) / 3) {
      console.log('tap right! ' + nativeEvent.pageX);
      props.nextStoryFn();
    } else {
      console.log('tap!');
    }
  };

  const handleArticleNavigation = () => {
    navigation?.push(ScreenNames.articleDetails, {
      data: {Id: props.item.Id},
    });
  };

  const handleEventNavigation = () => {
    navigation?.push(ScreenNames.eventDetails, {
      data: {Id: props.item.Id},
    });
  };

  return (
    <View style={{width: safeFrame.width, height: safeFrame.height}}>
      {props.item.ContentType === CardTypes.Article && (
        <Pressable onPress={handlePress}>
          <View
            style={{
              width: safeFrame.width,
              height: safeFrame.height,
            }}>
            <ArticleStory
              item={props.item}
              story={{
                nextStoryFn: props.nextStoryFn,
                prevStoryFn: props.prevStoryFn,
              }}
              text={'Read Article'}
              handleNavigation={handleArticleNavigation}
            />
          </View>
        </Pressable>
      )}
      {props.item.ContentType === CardTypes.EventDetails && (
        <Pressable onPress={handlePress}>
          <View
            style={{
              width: safeFrame.width,
              height: safeFrame.height,
            }}>
            <ArticleStory
              item={props.item}
              story={{
                nextStoryFn: props.nextStoryFn,
                prevStoryFn: props.prevStoryFn,
              }}
              text={'Show Event'}
              handleNavigation={handleEventNavigation}
            />
          </View>
        </Pressable>
      )}
      {props.item.ContentType === CardTypes.Poll && (
        <Pressable onPress={handlePress}>
          <View
            style={{
              width: safeFrame.width,
              height: safeFrame.height,
            }}>
            <Poll
              route={{
                params: {
                  data: {Id: props.item.Id},
                  isReel: false,
                  reel: {
                    nextReelFn: () => {},
                    prevReelFn: () => {},
                  },
                  story: {
                    stopStoryAutoscroll: props.stopStoryAutoScroll,
                  },
                },
              }}
            />
          </View>
        </Pressable>
      )}
      {props.item.ContentType === CardTypes.Quiz && (
        <Pressable onPress={handlePress}>
          <View
            style={{
              width: safeFrame.width,
              height: safeFrame.height,
            }}>
            <Quiz
              route={{
                params: {
                  data: {Id: props.item.Id},
                  isReel: false,
                  reel: {
                    nextReelFn: () => {},
                    prevReelFn: () => {},
                  },
                  story: {
                    stopStoryAutoscroll: props.stopStoryAutoScroll,
                  },
                },
              }}
            />
          </View>
        </Pressable>
      )}
      {props.item.ContentType === CardTypes.Video && (
        <View
          style={{
            width: safeFrame.width,
            height: safeFrame.height,
          }}>
          <VideoStory
            data={{id: props.item.Id ?? ''}}
            title={
              props?.item?.Title.length > 0
                ? props?.item?.Title
                : props.item?.Thumbnail?.Title
            }
            currIndex={props.currIndex}
            thisIndex={props.thisIndex}
            nextReelFn={props.nextStoryFn}
            prevReelFn={props.prevStoryFn}
            setCustomUpdate={props.setCustomUpdate}
            customProgressUpdate={props.customProgressUpdate}
          />
        </View>
      )}
      {props.item.ContentType !== CardTypes.Article &&
        props.item.ContentType !== CardTypes.EventDetails &&
        props.item.ContentType !== CardTypes.Poll &&
        props.item.ContentType !== CardTypes.Quiz &&
        props.item.ContentType !== CardTypes.Video && (
          <DefaultStory
            item={props.item}
            dimensions={{width: safeFrame.width, height: safeFrame.height}}
            handlePress={handlePress}
          />
        )}
    </View>
  );
};

export default React.memo(Story, (prevProps, nextProps) => {
  const prev = JSON.stringify(prevProps);
  const next = JSON.stringify(nextProps);
  return prev === next;
});
