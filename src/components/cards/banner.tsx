/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import {theme} from '@app/constants';
import screensUtils from '@app/utils/screensUtils';
import {useHandleCardClick} from '@app/deeplinks/cardDeeplinks';
import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useAppContext} from '@app/store/appContext';

const Banner = ({data}: any) => {
  const screenWidth = screensUtils.screenWidth;
  const containerWidth =
    screenWidth - (theme.cardMargin.left + theme.cardMargin.right);
  const cardClickHandle = useHandleCardClick(data, []);
  const {appConfigData} = useAppContext();

  const styles = StyleSheet.create({
    container: {
      position: 'relative', // Required for absolute positioning
      overflow: 'hidden', // Prevent image overflow
      borderRadius: theme.border.borderRadius,
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
    cardInfo: {
      marginTop: 'auto',
      flexDirection: 'column',
      gap: theme.cardPadding.defaultPadding,
    },
    description: {
      fontFamily: theme.fonts.HCLTechRoobert.bold,
      fontSize: theme.fontSize.font20,
      color: appConfigData?.primary_text_color,
    },
  });

  return (
    <TouchableOpacity onPress={cardClickHandle} activeOpacity={1}>
      <View style={[styles.container, {width: containerWidth, height: 200}]}>
        <Image source={data.bannerImage} />
        <LinearGradient
          colors={['#00000000', '#000000']}
          style={styles.gradient}>
          <View style={styles.cardInfo}>
            <Text style={styles.description} numberOfLines={2}>
              {data.Title}
            </Text>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

export default Banner;
