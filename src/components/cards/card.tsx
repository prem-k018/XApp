/* eslint-disable react/self-closing-comp */
import {theme} from '@app/constants';
import screensUtils from '@app/utils/screensUtils';
import {useHandleCardClick} from '@app/deeplinks/cardDeeplinks';
import React, {memo} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {icons} from '@app/assets/icons';
import CardTypes from './cardTypes';
import CardDetails from './cardDetails';
import {loadImageForHomePage} from '@app/utils/imageLinkUtils';
import {useAppContext} from '@app/store/appContext';

const Card = ({data, recentItems}: any) => {
  // Get the screen width and calculate the container's width and height
  const screenWidth = screensUtils.screenWidth;
  const containerWidth =
    screenWidth - (theme.cardMargin.left + theme.cardMargin.right); // 16 pixels on each side
  const containerHeight = containerWidth; // Maintain 1:1 aspect ratio
  const cardClickHandle = useHandleCardClick(data, recentItems);
  const {appConfigData} = useAppContext();

  const result = loadImageForHomePage(data);

  const styles = StyleSheet.create({
    container: {
      position: 'relative', // Required for absolute positioning
      overflow: 'hidden', // Prevent image overflow
      borderRadius: theme.card.defaultBorderRadius,
      marginBottom: theme.cardMargin.bottom,
      marginLeft: theme.cardMargin.left,
    },
    image: {
      width: '100%', // Ensure the image takes up the entire container width
      height: '100%', // Ensure the image takes up the entire container height
    },
    gradient: {
      position: 'absolute',
      flexDirection: 'column',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      paddingTop: theme.cardPadding.defaultPadding,
      paddingHorizontal: theme.cardPadding.defaultPadding,
      paddingBottom: 27,
    },
    cardType: {
      marginBottom: 'auto',
      height: 32,
      backgroundColor: theme.colors.primaryWhite,
      borderRadius: 20,
      justifyContent: 'center',
      alignSelf: 'flex-start',
      alignItems: 'center',
      paddingLeft: 18,
      paddingRight: 21,
    },
    cardTypeTitle: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.primary_color,
    },
    cardInfo: {
      marginTop: 'auto',
      flexDirection: 'column',
      gap: theme.cardPadding.defaultPadding,
    },
    description: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      fontSize: theme.fontSize.font20,
      color: appConfigData?.primary_text_color,
    },
    cardInfoDivider: {
      borderBottomColor: appConfigData?.primary_text_color,
      borderBottomWidth: theme.border.borderWidth,
    },
    playVideoIcon: {
      width: 56,
      height: 56,
    },
  });

  return (
    <TouchableOpacity onPress={cardClickHandle} activeOpacity={1}>
      <View
        style={[
          styles.container,
          {width: containerWidth, height: containerHeight},
        ]}>
        {result.isColor ? (
          <View style={[styles.image, {backgroundColor: result.value}]}></View>
        ) : (
          <FastImage
            style={styles.image}
            source={{
              uri: result.value,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        )}
        <LinearGradient
          colors={['#00000000', '#000000']}
          style={styles.gradient}>
          <View style={styles.cardType}>
            <Text style={styles.cardTypeTitle}>{data.ContentType}</Text>
          </View>

          <View style={styles.cardInfo}>
            {data.ContentType === CardTypes.Video && (
              <Image source={icons.playVideo} style={styles.playVideoIcon} />
            )}
            <Text
              style={styles.description}
              numberOfLines={data.ContentType === CardTypes.Video ? 2 : 3}>
              {data.Title}
            </Text>

            <View style={styles.cardInfoDivider} />
            <CardDetails data={data} />
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

export default memo(Card);
