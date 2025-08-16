/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, {ElementRef, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Video from 'react-native-video';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import ProgressBar from '../ui-components/progressBar';
import screensUtils from '@app/utils/screensUtils';
import {useSafeAreaFrame} from 'react-native-safe-area-context';
import {icons} from '@app/assets/icons';
import {theme} from '@app/constants';
import LinearGradient from 'react-native-linear-gradient';
import LoadingScreen from '@app/screens/loadingScreen/loadingScreen';
import {useTranslation} from 'react-i18next';
import {useAppContext} from '@app/store/appContext';
import {sessionTimeout} from '@app/constants/errorCodes';
import providePoints from '@app/services/openLoyalty/loyaltyPoint';
import getContentDetail from '@app/services/contentType/contentDetail';

function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const VideoStory: React.FC<{
  data: {id: string};
  title: string;
  currIndex: number;
  thisIndex: number;
  nextReelFn: () => void;
  prevReelFn: () => void;
  setCustomUpdate: (custom: boolean) => void;
  customProgressUpdate: (progress: number, total: number) => void;
}> = ({
  data,
  title,
  currIndex,
  thisIndex,
  nextReelFn,
  prevReelFn,
  setCustomUpdate,
  customProgressUpdate,
}) => {
  const safeFrame = useSafeAreaFrame();

  const [buffering, setBuffering] = useState<boolean>(true);
  const [customUpdated, setCustomUpdated] = useState<boolean>(false);
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
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<string | null>(null);
  const {t} = useTranslation();

  useEffect(() => {
    getData({showLoader: true});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getData(options: {showLoader: boolean}) {
    const {showLoader} = options;

    try {
      if (showLoader) {
        setIsLoading(true); // Show loading indicator
        setIsError(null); // Reset the error message
      }
      const type = 'VOD';
      const contents = await getContentDetail(data.id as any, type);
      if ('data' in contents && contents?.data?.publish_contentDetail) {
        setVideoUrl(contents?.data?.publish_contentDetail?.DsapceVideoUrl);
      } else {
        setIsError('Something went wrong!!!!'); // Set the error message
      }
      // setIsLoading(false);
    } catch (err: any) {
      console.log(err.message);

      if (err.message !== sessionTimeout) {
        setIsError('Something went wrong!!!!'); // Set the error message
      }
    }
  }

  useEffect(() => {
    if (videoUrl !== '') {
      setIsLoading(false);
    }
  }, [videoUrl]);

  const handleRetry = () => {
    getData({showLoader: true});
  };

  const singleTap = Gesture.Tap().onEnd((_event, success) => {
    if (success) {
      if (_event.x < 40) {
        prevReelFn();
      } else if (_event.x > safeFrame.width - 40) {
        nextReelFn();
      } else {
        pauseVideo();
      }
    }
  });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((_event, success) => {
      if (success) {
        if (_event.x < safeFrame.width / 3) {
          console.log('double tap left!');
          setVideoJumpText('-10');
          flashJump();
          if (currTime <= 10.1) {
            videoRef.current?.seek(0, 0);
          } else {
            videoRef.current?.seek(currTime - 10);
          }
        } else if (_event.x > (2 * safeFrame.width) / 7) {
          console.log('double tap right!');
          setVideoJumpText('+10');
          flashJump();
          if (currTime >= playableTime - 10.1) {
            videoRef.current?.seek(playableTime, 0);
          } else {
            videoRef.current?.seek(currTime + 10);
          }
        } else {
          console.log('double tap!');
        }
      }
    });

  const taps = Gesture.Exclusive(doubleTap, singleTap);

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
    console.log('Pausing video');

    setvideoPaused(!videoPaused);
    flashPause();
  };

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
      // Accounting for case where playback error shows up upon attempting to load video
      //  but before we scroll to it.
      // Also accounting for case where video is still buffering by the time we scroll to it

      if (!playbackError) {
        setCustomUpdate(true);
        setCustomUpdated(true);
      }
      setOnReel(true);
    } else {
      setCustomUpdated(false);
      setOnReel(false);
    }
  }, [currIndex, thisIndex]);

  useEffect(() => {
    if (playbackError && currIndex === thisIndex) {
      // Accounting for case where playback error shows up while we're watching the video
      setCustomUpdate(false);
    }
  }, [playbackError]);

  useEffect(() => {
    if (prevOnReel && !onReel) {
      setvideoPaused(false);
    }
  }, [onReel, prevOnReel]);

  const handleVideoError = (error: any) => {
    console.log('Video playback error:', error);
    setPlaybackError(true);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.primaryBlack,
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

  return isLoading ? (
    <View style={styles.container}>
      <LoadingScreen
        isLoading={isLoading}
        error={isError}
        onRetry={handleRetry}
      />
    </View>
  ) : (
    <GestureDetector gesture={taps}>
      <View style={styles.container}>
        <Video
          ref={videoRef}
          source={{uri: videoUrl}}
          style={styles.backgroundVideo}
          resizeMode="cover"
          onBuffer={({isBuffering}: any) => {
            console.log('onBuffer called with ' + isBuffering);
            setBuffering(isBuffering);
          }}
          onError={handleVideoError}
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
            setCurrTime(currentTime);
            setPlayableTime(seekableDuration);
            customProgressUpdate(currentTime * 1000, seekableDuration * 1000);
          }}
          onEnd={async () => {
            nextReelFn();
            await providePoints(data.id ?? '');
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
        {buffering && !playbackError && (
          <View style={styles.bufferingIndicator}>
            <ActivityIndicator size="small" color="white" />
          </View>
        )}
        {playbackError && (
          <View style={styles.bufferingIndicator}>
            <Text style={styles.text}>{t('videoPlaybackError')}</Text>
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
      </View>
    </GestureDetector>
  );
};

export default VideoStory;
