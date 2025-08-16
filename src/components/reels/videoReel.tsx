/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Video from 'react-native-video';
import {ElementRef} from 'react';
import {
  Directions,
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import ProgressBar from '../ui-components/progressBar';
import screensUtils from '@app/utils/screensUtils';
import {useSafeAreaFrame} from 'react-native-safe-area-context';
import {icons} from '@app/assets/icons';
import {theme} from '@app/constants';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../ui-components/backButton';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import {useAppContext} from '@app/store/appContext';
import StorageService from '@app/utils/storageService';
import providePoints from '@app/services/openLoyalty/loyaltyPoint';
import {video_data, videoView} from '@app/constants/constants';
import {addEventForTracking} from '@app/services/tracking/rpiServices';
import ScreenNames from '@app/constants/screenNames';

function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const VideoReel: React.FC<{
  Id?: string;
  data: any;
  title?: string;
  currIndex?: number;
  thisIndex?: number;
  nextReelFn?: any;
  prevReelFn?: any;
  content?: any;
}> = ({
  Id,
  data,
  title,
  currIndex,
  thisIndex,
  nextReelFn,
  prevReelFn,
  content,
}) => {
  const safeFrame = useSafeAreaFrame();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [duration, setDuration] = useState<number>(0); // Total video duration
  const [buffering, setBuffering] = useState<boolean>(true);
  const [playbackError, setPlaybackError] = useState<boolean>(false);
  const [videoPaused, setvideoPaused] = useState(false);
  const pausingOpacityAnimation = useRef(new Animated.Value(0)).current;
  const [videoJumpText, setVideoJumpText] = useState<string>('');
  const videoJumpAnimation = useRef(new Animated.Value(0)).current;
  const [onReel, setOnReel] = useState(false);
  const prevOnReel = usePrevious({onReel, setOnReel});
  const videoRef = useRef<ElementRef<typeof Video>>(null);
  const {appConfigData} = useAppContext();
  const [currTime, setCurrTime] = useState(0);
  const [playableTime, setPlayableTime] = useState(100);
  const [streamTime, setStreamTime] = useState(0);
  const {t} = useTranslation();
  const milestoneRef = useRef({25: false, 50: false, 75: false});
  const lastStartTime = useRef(0);
  const prevTime = useRef(0);

  const onVideoLoad = (data: any) => {
    lastStartTime.current = Date.now();
    setDuration(data.duration);
    setStreamTime(0);
    setBuffering(false);
    videoEventTracking('Video start', data.duration, 0);
    milestoneRef.current = {25: false, 50: false, 75: false};
    prevTime.current = 0;
  };

  const videoEventTracking = async (
    action: string,
    videoLength?: any,
    streamLength?: any,
  ) => {
    if (content) {
      const extractId = (url: string) => {
        const match = url.match(/bitstreams\/([^/]+)\/content/);
        return match ? match[1] : null;
      };
      const tagsData = content[currIndex as any].tags;
      const cleanedData = tagsData.map((item: any) => item.replace(/"/g, ''));
      const tagString = cleanedData.join(' | ');

      const trackingData = {
        content_type: 'Video',
        ContentType: 'Video',
        screenType: videoView,
        videoAction: action,
        contentData: content[currIndex as any],
        mediaId: extractId(data.uri),
        videoDuration: videoLength
          ? parseInt(videoLength)
          : parseInt(duration as any),
        pageName: title,
        tags: tagString,
        streamDuration: streamLength ? parseInt(streamLength) : 0,
      };
      await addEventForTracking(trackingData);
    }
  };

  useEffect(() => {
    if (currTime > 0 && duration > 0) {
      handleProgress(currTime / duration);
    }
  }, [currTime, duration]);

  const singleTap = Gesture.Tap().onEnd((_event, success) => {
    if (success) {
      pauseVideo();
    }
  });

  useEffect(() => {
    return () => {
      handleComponentUnmount();
    };
  }, []);

  const handleComponentUnmount = async () => {
    let index = currIndex ?? 0;
    await StorageService.storeData(
      video_data,
      JSON.stringify({
        isWatched: false,
        id: content[index]?.id,
        data: content[index],
        remainingTIme: currTime.toString(),
      }),
    );
    setBuffering(false);
  };

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((_event, success) => {
      if (success) {
        if (_event.x < safeFrame.width / 3) {
          setVideoJumpText('-10');
          flashJump();
          if (currTime <= 10.1) {
            videoRef.current?.seek(0, 0);
          } else {
            videoRef.current?.seek(currTime - 10);
          }
        } else if (_event.x > (2 * safeFrame.width) / 7) {
          setVideoJumpText('+10');
          flashJump();
          if (currTime >= playableTime - 10.1) {
            videoRef.current?.seek(playableTime, 0);
          } else {
            videoRef.current?.seek(currTime + 10);
          }
        }
      }
    });

  const taps = Gesture.Exclusive(doubleTap, singleTap);

  const downFling = Gesture.Fling()
    .direction(Directions.DOWN)
    .onEnd((_, success) => {
      if (success) {
        prevReelFn();
      }
    });

  const upFling = Gesture.Fling()
    .direction(Directions.UP)
    .onEnd((_, success) => {
      if (success) {
        nextReelFn();
      }
    });

  const flings = Gesture.Exclusive(downFling, upFling);

  const gestures = Gesture.Exclusive(flings, taps);

  const flashJump = () => {
    Animated.timing(videoJumpAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(({}: {finished: boolean}) => {
      Animated.timing(videoJumpAnimation, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
    });
  };

  const pauseVideo = () => {
    setvideoPaused(!videoPaused);
    if (!videoPaused) {
      // Pausing the video
      const durationWatched = (Date.now() - lastStartTime.current) / 1000;
      const updatedStreamTime = streamTime + durationWatched;
      console.log('Updated stream Time ==> ', updatedStreamTime);
      setStreamTime(updatedStreamTime);
      videoEventTracking('Video pause', null, updatedStreamTime.toFixed(2));
    } else {
      // Resuming the video
      lastStartTime.current = Date.now();
      videoEventTracking('Video play', null, streamTime.toFixed(2));
    }
    flashPause();
  };

  const handleVideoStop = () => {
    const durationWatched =
      (Date.now() - lastStartTime.current) / 1000 + streamTime;
    setStreamTime(durationWatched);
    videoEventTracking('Video stop', duration, durationWatched.toFixed(2));
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      handleVideoStop();
    });

    return unsubscribe;
  }, [navigation, streamTime, duration]);

  const flashPause = () => {
    Animated.timing(pausingOpacityAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(({}: {finished: boolean}) => {
      Animated.timing(pausingOpacityAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  };

  useEffect(() => {
    if (currIndex === thisIndex) {
      setOnReel(true);
    } else {
      setOnReel(false);
    }
  }, [currIndex, thisIndex]);

  useEffect(() => {
    if (prevOnReel && !onReel) {
      setvideoPaused(false);
    }
  }, [onReel, prevOnReel]);

  const handleBuffer = ({isBuffering}: any) => {
    console.log(`Buffering state changed: ${isBuffering}`);
    setBuffering(isBuffering);
  };

  const handleVideoError = (error: any) => {
    console.log('Video playback error:', error);
    setPlaybackError(true);
    setBuffering(false);
  };

  const handleVideoEnd = async () => {
    const durationWatched =
      (Date.now() - lastStartTime.current) / 1000 + streamTime;
    videoEventTracking('Video complete', null, durationWatched.toFixed(2));
    console.log(`Total stream time: ${durationWatched.toFixed(2)} seconds`);
    await providePoints(Id ?? '');
    setStreamTime(0);
    setBuffering(false);
  };

  const handleVideoStart = () => {
    videoEventTracking('Video start', duration, 0);
    lastStartTime.current = Date.now();
    setStreamTime(0);
    milestoneRef.current = {25: false, 50: false, 75: false};
  };

  const handleProgress = (progress: number) => {
    const currentTime =
      (Date.now() - lastStartTime.current) / 1000 + streamTime;

    if (progress >= 0.25 && !milestoneRef.current[25]) {
      milestoneRef.current[25] = true;
      videoEventTracking('Video stream 25', null, currentTime.toFixed(2));
    }
    if (progress >= 0.5 && !milestoneRef.current[50]) {
      milestoneRef.current[50] = true;
      videoEventTracking('Video stream 50', null, currentTime.toFixed(2));
    }
    if (progress >= 0.75 && !milestoneRef.current[75]) {
      milestoneRef.current[75] = true;
      videoEventTracking('Video stream 75', null, currentTime.toFixed(2));
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.fullBlack,
    },
    video: {
      flex: 1,
    },
    backgroundVideo: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    bufferingIndicator: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: appConfigData?.primary_text_color,
    },
    text: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      color: appConfigData?.primary_text_color,
      fontSize: theme.fontSize.font20,
    },
    titleView: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingHorizontal: theme.cardMargin.left,
      paddingVertical: 50,
    },
    titleText: {
      fontFamily: theme.fonts.HCLTechRoobert.medium,
      color: appConfigData?.primary_text_color,
      fontSize: theme.fontSize.font20,
    },
    gradient: {
      position: 'absolute',
      flexDirection: 'column',
      bottom: 0,
      left: 0,
      right: 0,
      height: 300,
    },
    videoPlay: {
      width: 70,
      height: 70,
      borderRadius: 35,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    animatedView: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
    videoJumpView: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    progressBar: {
      position: 'absolute',
      bottom: 0,
    },
  });

  return (
    <GestureDetector gesture={gestures}>
      <View style={styles.container}>
        <Video
          ref={videoRef}
          source={{uri: data.uri}}
          style={styles.backgroundVideo}
          resizeMode="cover"
          onBuffer={handleBuffer}
          onLoad={onVideoLoad}
          onError={handleVideoError}
          onEnd={handleVideoEnd}
          controls={false}
          repeat={true}
          paused={!onReel || videoPaused}
          onProgress={({
            currentTime,
            seekableDuration,
          }: {
            currentTime: number;
            seekableDuration: number;
          }) => {
            if (currentTime < prevTime.current) {
              handleVideoEnd();
              handleVideoStart();
            }
            handleProgress(currentTime / duration);
            prevTime.current = currentTime;
            setCurrTime(currentTime);
            setPlayableTime(seekableDuration);
          }}
        />
        <LinearGradient
          colors={['#00000000', 'rgba(0, 0, 0, 0.7)']}
          style={styles.gradient}></LinearGradient>
        {!playbackError && (
          <View style={styles.titleView}>
            <Text numberOfLines={4} style={styles.titleText}>
              {title}
            </Text>
          </View>
        )}
        {buffering && !playbackError && !videoPaused && (
          <View style={styles.bufferingIndicator}>
            <ActivityIndicator size="small" color="white" />
          </View>
        )}
        {playbackError && (
          <View style={styles.bufferingIndicator}>
            <Text style={styles.text}> {t('videoPlaybackError')}</Text>
          </View>
        )}
        <Animated.View
          style={[
            {
              height: safeFrame.height,
              width: safeFrame.width,
              opacity: pausingOpacityAnimation,
            },
            styles.animatedView,
          ]}>
          <View style={styles.videoPlay}>
            {!videoPaused && (
              <Image
                source={icons.playButtonWhite}
                style={{width: 35, height: 35}}
              />
            )}
            {videoPaused && (
              <Image
                source={icons.pauseButtonWhite}
                style={{width: 35, height: 35}}
              />
            )}
          </View>
        </Animated.View>
        <Animated.View
          style={[
            {
              height: safeFrame.height,
              width: safeFrame.width,
              opacity: videoJumpAnimation,
            },
            styles.animatedView,
          ]}>
          <View style={styles.videoJumpView}>
            <Image
              source={
                videoJumpText === '+10'
                  ? icons.videoForward
                  : icons.videoBackward
              }
              style={{width: 48, height: 48}}
            />
          </View>
        </Animated.View>
        <View style={styles.progressBar}>
          <ProgressBar
            progress={currTime}
            progressTotal={playableTime}
            maxWidth={screensUtils.windowWidth}
          />
        </View>
        <BackButton onPress={() => navigation?.goBack()} />
      </View>
    </GestureDetector>
  );
};

export default React.memo(VideoReel);
