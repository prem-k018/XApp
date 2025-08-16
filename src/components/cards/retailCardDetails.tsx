import React, {memo, useCallback, useState} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import Share from 'react-native-share';
import {icons} from '@app/assets/icons';
import {shareURL} from '@app/utils/imageLinkUtils';
import {useAppContext} from '@app/store/appContext';
import CardType from '@app/components/cards/cardTypes';
import StorageService from '@app/utils/storageService';
import {useFocusEffect} from '@react-navigation/native';
import theme from '@app/constants/theme';

const RetailCardDetails = ({data}: any) => {
  const {appConfigData} = useAppContext();
  const [bookmarked, setBookmarked] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      async function checkBookmarkStatus() {
        const bookmarks = await StorageService.getData('bookmarkArray');
        if (bookmarks) {
          const bookmarksObject = JSON.parse(bookmarks);
          setBookmarked(!!bookmarksObject[data.Id]);
        }
      }
      checkBookmarkStatus();
    }, [data.Id]),
  );

  const handleBookmark = useCallback(async () => {
    async function updateBookmark() {
      const bookmarks = await StorageService.getData('bookmarkArray');
      const bookmarksObject = bookmarks ? JSON.parse(bookmarks) : {};
      if (bookmarked) {
        delete bookmarksObject[data.Id];
      } else {
        bookmarksObject[data.Id] = true;
      }
      await StorageService.storeData(
        'bookmarkArray',
        JSON.stringify(bookmarksObject),
      );
      setBookmarked(!bookmarked);
    }
    updateBookmark();
  }, [bookmarked, data.Id]);

  const handleShare = useCallback(() => {
    const urlToShare = shareURL(data.ContentType, data.CurrentPageURL);
    shareUrl(urlToShare);
  }, [data.ContentType, data.CurrentPageURL]);

  const shareUrl = async (url: string) => {
    try {
      const options = {
        message: url,
      };
      await Share.open(options);
    } catch (error: any) {
      console.log('Error sharing:', error.message);
    }
  };

  const renderTitle = () => {
    switch (data.ContentType) {
      case CardType.Poll:
        return data?.Question.length > 0 ? data?.Question : data?.Title;
      case CardType.Video:
        return data?.Title.length > 0 ? data?.Title : data?.Thumbnail?.Title;
      default:
        return data.Title;
    }
  };

  const renderDescription = () => {
    switch (data.ContentType) {
      case CardType.Video:
        return (
          <Text style={styles.description} numberOfLines={2}>
            {data?.Description.length > 0
              ? data?.Description
              : data?.Thumbnail?.Description}
          </Text>
        );
      default:
        return (
          <Text style={styles.description} numberOfLines={2}>
            {data.Description}
          </Text>
        );
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 15,
      gap: 5,
    },
    cardDetailsRow: {
      flexDirection: 'row',
      gap: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      flex: 1,
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
    },
    description: {
      flex: 1,
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font12,
      color: '#838589',
    },
    cardIcons: {
      width: 24,
      height: 24,
    },
    shareIcon: {
      height: 20,
      width: 20,
      tintColor: appConfigData?.secondary_text_color,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.cardDetailsRow}>
        <Text style={styles.title} numberOfLines={1}>
          {renderTitle()}
        </Text>
        <TouchableOpacity
          onPress={handleShare}
          activeOpacity={1}
          hitSlop={{bottom: 20, left: 20, top: 20, right: 15}}>
          <Image source={icons.cardShare} style={styles.shareIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleBookmark}
          activeOpacity={1}
          hitSlop={{bottom: 10, left: 10, top: 10, right: 10}}>
          {bookmarked ? (
            <Image source={icons.cardBookmarkActive} style={styles.cardIcons} />
          ) : (
            <Image
              source={icons.cardBookmark}
              style={[
                styles.cardIcons,
                {tintColor: appConfigData?.secondary_text_color},
              ]}
            />
          )}
        </TouchableOpacity>
      </View>
      {renderDescription()}
    </View>
  );
};

export default memo(RetailCardDetails);
