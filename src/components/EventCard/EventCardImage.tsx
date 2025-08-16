/* eslint-disable react/self-closing-comp */
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {theme} from '@app/constants';
import {useAppContext} from '@app/store/appContext';
import FastImage from 'react-native-fast-image';

export type Props = {
  imageHeight: number;
  imageWidth: number;
  eventImage: string;
  eventDuration: string;
  eventTitle: string;
  icon: any;
  arrowPressed: () => void;
};

const EventCardImage: React.FC<Props> = ({
  imageHeight,
  imageWidth,
  eventImage,
  eventDuration,
  eventTitle,
  icon,
  arrowPressed,
}) => {
  const {appConfigData} = useAppContext();

  const calculateTimeLeft = () => {
    const difference = new Date(eventDuration).getTime() - new Date().getTime();
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return {
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
      };
    } else {
      return null;
    }
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const styles = StyleSheet.create({
    titleView: {
      position: 'absolute',
      left: theme.cardPadding.defaultPadding,
      right: theme.cardPadding.defaultPadding,
      bottom: 49,
      gap: 10,
    },
    iconView: {
      alignSelf: 'center',
    },
    text: {
      color: appConfigData?.primary_text_color,
      fontFamily: theme.fonts.Inter.regular,
      fontSize: theme.fontSize.font16,
    },
    duration: {
      color: appConfigData?.primary_text_color,
      fontFamily: theme.fonts.Inter.semiBold,
      fontSize: theme.fontSize.font20,
    },
    underline: {
      borderBottomColor: theme.colors.grayScale4,
      borderBottomWidth: theme.border.borderWidth,
    },
    title: {
      color: appConfigData?.primary_text_color,
      fontFamily: theme.fonts.HCLTechRoobert.medium,
      fontSize: theme.fontSize.font28,
    },
    linearGradient: {
      backgroundColor: 'transparent',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  });

  return (
    <View>
      <FastImage
        style={{height: imageHeight, width: imageWidth}}
        source={{uri: eventImage, priority: FastImage.priority.high}}
        resizeMode="cover">
        <LinearGradient
          colors={['#00000000', '#00000080']}
          style={styles.linearGradient}></LinearGradient>
      </FastImage>
      <View style={styles.titleView}>
        {timeLeft !== null ? (
          <>
            <Text style={styles.text}>Event will start in</Text>
            <Text style={styles.duration}>
              {timeLeft.days} days {timeLeft.hours} hours {timeLeft.minutes} min{' '}
              {timeLeft.seconds} sec
            </Text>
            <View style={styles.underline} />
          </>
        ) : null}
        <Text numberOfLines={3} style={styles.title}>
          {eventTitle}
        </Text>
        <View style={styles.iconView}>
          <TouchableOpacity
            onPress={arrowPressed}
            hitSlop={{bottom: 20, left: 20, top: 20, right: 20}}>
            <Image source={icon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default memo(EventCardImage);
