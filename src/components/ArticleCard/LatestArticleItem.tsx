/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {memo} from 'react';
import {theme} from '@app/constants';
import {getDatePosted} from '@app/utils/HelperFunction';
import ArticleReadMore from './ArticleReadMore';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ScreenNames from '@app/constants/screenNames';
import {useAppContext} from '@app/store/appContext';
import {loadImage} from '@app/utils/imageLinkUtils';

const LatestArticleItem = ({item, index}: any) => {
  const datePosted = getDatePosted(item.published_date);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {appConfigData} = useAppContext();

  function readMoreHandler() {
    navigation.push(ScreenNames.articleDetails, {
      data: {
        Id: item.current_page_url.split('/')[1],
      },
    });
  }
  const styles = StyleSheet.create({
    articleItem: {
      marginRight: 14,
      borderRadius: theme.border.borderRadius,
      borderWidth: theme.border.borderWidth,
      borderColor: theme.colors.grayScale4,
      alignItems: 'center',
      backgroundColor: theme.colors.primaryWhite,
      width: 270,
    },
    image: {
      width: 270,
      height: 120,
      resizeMode: 'cover',
      flexShrink: 0,
      borderTopRightRadius: theme.border.borderRadius,
      borderTopLeftRadius: theme.border.borderRadius,
    },
    innerContainer: {
      flex: 1,
      margin: theme.cardPadding.defaultPadding,
      gap: 10,
    },
    title: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.secondary_text_color,
    },
    date: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.lightGray,
    },
    readMore: {
      flex: 1,
    },
  });

  const portraitImage = item.published_images.find(
    (image: {aspect_ratio: string}) => image.aspect_ratio === 'hero',
  );
  const ext = item.original_image.ext || '';
  let bannerURL = '';

  if (portraitImage) {
    const portraitValue = portraitImage.folder_path;
    bannerURL = loadImage(portraitValue, ext);
  }

  return (
    <View
      style={[
        styles.articleItem,
        index === 0 ? {marginLeft: theme.cardPadding.defaultPadding} : null,
      ]}>
      <TouchableOpacity onPress={readMoreHandler} activeOpacity={1}>
        <Image style={styles.image} source={{uri: bannerURL}} />
        <View style={styles.innerContainer}>
          <Text style={styles.date}>{datePosted}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.readMore}>
            <ArticleReadMore />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default memo(LatestArticleItem);
