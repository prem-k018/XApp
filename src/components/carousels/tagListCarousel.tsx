/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import {theme} from '@app/constants';
import {useHandleCardClick} from '@app/deeplinks/cardDeeplinks';
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {icons} from '@app/assets/icons';
import {loadImageForHomePage} from '@app/utils/imageLinkUtils';
import {useAppContext} from '@app/store/appContext';
import CardTypes from '../cards/cardTypes';
import CardDetails from '../cards/cardDetails';

const TagListCarousel = ({data}: {data: any}) => {
  const styles = StyleSheet.create({
    carousel: {
      paddingLeft: 0, // Adjust the left padding to offset the initial item
      paddingBottom: theme.cardMargin.bottom,
    },
  });
  return (
    <FlatList
      data={data}
      renderItem={({item, index}) => <TagListItem data={item} index={index} />}
      keyExtractor={(item, index) => `${item.Id}${index}`}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carousel}
    />
  );
};

const TagListItem = ({data, recentItems, index}: any) => {
  const cardClickHandle = useHandleCardClick(data, recentItems);
  const {appConfigData} = useAppContext();

  const result = loadImageForHomePage(data);

  const styles = StyleSheet.create({
    container: {
      position: 'relative', // Required for absolute positioning
      overflow: 'hidden', // Prevent image overflow
      borderRadius: theme.card.defaultBorderRadius,
      marginRight: theme.cardMargin.left,
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
      paddingBottom: 15,
    },
    cardType: {
      marginBottom: 'auto',
      height: 26,
      backgroundColor: theme.colors.primaryWhite,
      borderRadius: 20,
      justifyContent: 'center',
      alignSelf: 'flex-start',
      alignItems: 'center',
      paddingLeft: 10,
      paddingRight: 10,
    },
    cardTypeTitle: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      fontSize: theme.fontSize.font12,
      color: appConfigData?.primary_color,
    },
    cardInfo: {
      marginTop: 'auto',
      flexDirection: 'column',
      gap: 8,
    },
    description: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.primary_text_color,
    },
    cardInfoDivider: {
      borderBottomColor: appConfigData?.primary_text_color,
      borderBottomWidth: theme.border.borderWidth,
    },
    playVideoIcon: {
      width: 35,
      height: 35,
    },
  });

  return (
    <TouchableOpacity onPress={cardClickHandle} activeOpacity={1}>
      <View
        style={[
          styles.container,
          {width: 200, height: 220},
          index === 0 ? {marginLeft: theme.cardMargin.left} : null,
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

export default TagListCarousel;
