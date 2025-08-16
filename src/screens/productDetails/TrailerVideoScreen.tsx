import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import screensUtils from '@app/utils/screensUtils';
import VideoReel from '@app/components/reels/videoReel';

const TrailerVideoScreen: React.FC = ({route}: any) => {
  const {item} = route.params;

  const nextReelFn = () => {
    console.log('Only one video available');
  };

  const prevReelFn = () => {
    console.log('Only one video available');
  };

  const styles = StyleSheet.create({});
  return (
    <View
      style={{
        width: screensUtils.screenWidth,
        height: screensUtils.screenHeight,
      }}>
      <VideoReel
        data={{uri: item}}
        nextReelFn={nextReelFn}
        prevReelFn={prevReelFn}
      />
    </View>
  );
};

export default TrailerVideoScreen;
