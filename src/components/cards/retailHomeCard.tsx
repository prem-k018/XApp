/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import {theme} from '@app/constants';
import screensUtils from '@app/utils/screensUtils';
import {useHandleCardClick} from '@app/deeplinks/cardDeeplinks';
import React, {memo, useMemo} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {icons} from '@app/assets/icons';
import CardTypes from './cardTypes';
import {loadImageForHomePage} from '@app/utils/imageLinkUtils';
import {useAppContext} from '@app/store/appContext';
import RetailCardDetails from './retailCardDetails';

const RetailHomeCard = ({data, recentItems}: any) => {
  // Get the screen width and calculate the container's width and height
  const screenWidth = screensUtils.screenWidth;
  const containerWidth =
    screenWidth - (theme.cardMargin.left + theme.cardMargin.right); // 16 pixels on each side
  const cardClickHandle = useHandleCardClick(data, recentItems);

  const {appConfigData} = useAppContext();

  const result = useMemo(() => loadImageForHomePage(data), [data]);

  const containerStyle = {
    ...styles.container,
    backgroundColor: appConfigData?.background_color,
  };

  const contentStyle = {
    ...styles.content,
    backgroundColor: appConfigData?.background_color,
  };

  const textStyles = {
    color: appConfigData?.primary_text_color,
  };

  const contentTextStyles = {
    ...styles.contentText,
    color: appConfigData?.secondary_text_color,
  };

  const renderContentType = () => {
    switch (data.ContentType) {
      case CardTypes.Article:
        return (
          <ContentTypeItem
            iconSource={icons.articleIcon}
            contentType={CardTypes.Article}
            imageStyle={styles.articleImage}
            textStyles={textStyles}
          />
        );
      case CardTypes.Quiz:
        return (
          <>
            <ContentTypeItem
              iconSource={icons.quizIcon}
              contentType={CardTypes.Quiz}
              textStyles={textStyles}
            />
            <View style={styles.cardInfo}>
              <View style={contentStyle}>
                <Text style={contentTextStyles}>Let’s Start</Text>
                <Image source={icons.backIcon} style={styles.backIcon} />
              </View>
            </View>
          </>
        );
      case CardTypes.Video:
        return (
          <>
            <ContentTypeItem
              iconSource={icons.VODIcon}
              contentType={CardTypes.Video}
              textStyles={textStyles}
            />
            <View style={styles.cardInfo}>
              <Image source={icons.videoPlay} style={styles.playVideoIcon} />
            </View>
          </>
        );
      case CardTypes.EventDetails:
        return (
          <ContentTypeItem
            iconSource={icons.EventIcon}
            contentType={CardTypes.EventDetails}
            textStyles={textStyles}
          />
        );
      default:
        return <Text>NA</Text>;
    }
  };

  return (
    <TouchableOpacity onPress={cardClickHandle} activeOpacity={1}>
      <View style={[containerStyle, {width: containerWidth, height: 'auto'}]}>
        {result.isColor ? (
          <View style={[styles.image, {backgroundColor: result.value}]}>
            {renderContentType()}
          </View>
        ) : (
          <FastImage
            style={styles.image}
            source={{
              uri: result.value,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}>
            <LinearGradient
              colors={['#15000000', '#150000']}
              style={styles.gradient}>
              {renderContentType()}
            </LinearGradient>
          </FastImage>
        )}
        <RetailCardDetails data={data} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative', // Required for absolute positioning
    overflow: 'hidden', // Prevent image overflow
    marginLeft: theme.cardMargin.left,
    padding: 15,
    borderRadius: theme.border.borderRadius,
  },
  image: {
    width: '100%', // Ensure the image takes up the entire container width
    height: 150, // Ensure the image takes up the entire container height
  },
  gradient: {
    flex: 1,
    position: 'absolute',
    flexDirection: 'column',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    width: '100%',
  },
  cardType: {
    position: 'absolute',
    paddingTop: 10,
    flexDirection: 'row',
  },
  cardContainer: {
    gap: 4,
    flexDirection: 'row',
    paddingHorizontal: 8,
    height: 25,
    backgroundColor: '#3A9B7A',
    borderTopRightRadius: theme.border.borderRadius,
    borderBottomRightRadius: theme.border.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingLeft: 15,
    borderRadius: theme.border.borderRadius,
    gap: 4,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontFamily: theme.fonts.DMSans.semiBold,
    fontSize: theme.fontSize.font14,
  },
  backIcon: {
    height: 18,
    width: 15,
    transform: [{rotate: '180deg'}],
  },
  cardTypeTitle: {
    paddingTop: screensUtils.isAndroid ? 0 : 1,
    fontFamily: theme.fonts.DMSans.medium,
    fontSize: theme.fontSize.font10,
  },
  contentIcon: {
    height: 18,
    width: 18,
  },
  articleImage: {
    height: 13,
    width: 11,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  playVideoIcon: {
    width: 36,
    height: 36,
  },
});

const ContentTypeItem = ({
  iconSource,
  contentType,
  imageStyle,
  textStyles,
}: any) => (
  <View style={styles.cardType}>
    <View style={styles.cardContainer}>
      {iconSource && (
        <Image source={iconSource} style={[styles.contentIcon, imageStyle]} />
      )}
      <Text style={[styles.cardTypeTitle, textStyles]}>{contentType}</Text>
    </View>
  </View>
);

export default memo(RetailHomeCard);
