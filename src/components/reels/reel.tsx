/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View} from 'react-native';
import VideoReel from '@app/components/reels/videoReel';
import Quiz from '@app/screens/quiz/quiz';
import Poll from '@app/screens/poll/poll';
import ArticleDetailsReel from './articleDetailsReel';
import CardTypes from '../cards/cardTypes';
import {Directions, Gesture} from 'react-native-gesture-handler';
import SafeAreaUtils from '@app/utils/safeAreaUtils';

type ReelProps = {
  id: string;
  type: string;
  uri: string;
  title: string;
  currIndex: number;
  thisIndex: number;
  nextReelFn: () => void;
  prevReelFn: () => void;
  content: any;
};

const Reel = (props: ReelProps) => {
  const [downFlingActive, setDownFlingActive] = useState<boolean>(true);
  const [upFlingActive, setUpFlingActive] = useState<boolean>(true);
  const safeFrame = SafeAreaUtils.getSafeAreaFrame();

  const downFling = Gesture.Fling()
    .enabled(downFlingActive)
    .direction(Directions.DOWN)
    .onEnd((_, success) => {
      if (success) {
        console.log('downFling');
        props.prevReelFn();
      }
    });

  const upFling = Gesture.Fling()
    .enabled(upFlingActive)
    .direction(Directions.UP)
    .onEnd((_, success) => {
      if (success) {
        console.log('upFling');
        props.nextReelFn();
      }
    });

  const flings = Gesture.Exclusive(downFling, upFling);
  const nativeGesture = Gesture.Native();
  const scrollViewCompositeGesture = Gesture.Exclusive(flings, nativeGesture);

  return (
    <View style={{width: safeFrame.width, height: safeFrame.height}}>
      {props.type === CardTypes.Video && props?.id && (
        <VideoReel
          Id={props.id}
          data={props}
          title={props.title}
          currIndex={props.currIndex}
          thisIndex={props.thisIndex}
          nextReelFn={props.nextReelFn}
          prevReelFn={props.prevReelFn}
          content={props.content}
        />
      )}
      {props.type === CardTypes.Article && (
        <ArticleDetailsReel
          id={props.uri ?? ''}
          reel={{
            nextReelFn: props.nextReelFn,
            prevReelFn: props.prevReelFn,
          }}
        />
      )}
      {props.type === CardTypes.Quiz && (
        <Quiz
          route={{
            params: {
              data: {Id: props.uri},
              isReel: true,
              reel: {
                gesture: scrollViewCompositeGesture,
                setDownFlingActive: setDownFlingActive,
                setUpFlingActive: setUpFlingActive,
              },
            },
          }}
        />
      )}
      {props.type === CardTypes.Poll && (
        <Poll
          route={{
            params: {
              data: {Id: props.uri},
              isReel: true,
              reel: {
                gesture: scrollViewCompositeGesture,
                setDownFlingActive: setDownFlingActive,
                setUpFlingActive: setUpFlingActive,
              },
            },
          }}
        />
      )}
    </View>
  );
};

export default React.memo(Reel);
