/* eslint-disable react-hooks/exhaustive-deps */
import {theme} from '@app/constants';
import React, {memo, useState} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import Share from 'react-native-share';
import {icons} from '@app/assets/icons';
import StorageService from '@app/utils/storageService';
import {timeToPresent} from '@app/utils/dateUtils';
import {useFocusEffect} from '@react-navigation/native';
import {shareURL} from '@app/utils/imageLinkUtils';
import {bookmarkArray} from '@app/constants/constants';
import {useAppContext} from '@app/store/appContext';

const CardDetails = ({data}: any) => {
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const {appConfigData} = useAppContext();
  useFocusEffect(() => {
    async function checkBookmarkStatus() {
      const bookmarks = await StorageService.getData(bookmarkArray);
      if (bookmarks) {
        const bookmarksObject = await JSON.parse(bookmarks);
        // if (bookmarksObject.hasOwnProperty(data.Id)) {
        //   setBookmarked(true);
        // }
        setBookmarked(bookmarksObject[data.Id]);
      }
    }

    checkBookmarkStatus();
  });

  function handleBookmark() {
    async function updateBookmark() {
      const bookmarks = await StorageService.getData(bookmarkArray);
      if (bookmarks) {
        const bookmarksObject = JSON.parse(bookmarks);
        if (bookmarked) {
          delete bookmarksObject[data.Id];
          await StorageService.storeData(
            bookmarkArray,
            JSON.stringify(bookmarksObject),
          );
          setBookmarked(false);
        } else {
          bookmarksObject[data.Id] = true;
          await StorageService.storeData(
            bookmarkArray,
            JSON.stringify(bookmarksObject),
          );
          setBookmarked(true);
        }
      } else {
        if (bookmarked) {
          //Something is wrong and this defaults the state back to false
          setBookmarked(false);
        } else {
          await StorageService.storeData(
            bookmarkArray,
            JSON.stringify({[data.Id]: true}),
          );
          setBookmarked(true);
        }
      }
    }

    updateBookmark();
  }

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

  function handleShare() {
    const urlToShare = shareURL(data.ContentType, data.CurrentPageURL);
    shareUrl(urlToShare);
  }

  const styles = StyleSheet.create({
    cardDetailsRow: {
      flexDirection: 'row',
    },
    cardDetailsRowLeftGroup: {
      marginRight: 'auto',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    timeStamp: {
      fontFamily: theme.fonts.Inter.regular,
      fontSize: theme.fontSize.font12,
      color: appConfigData?.primary_text_color,
    },
    cardDetailsRowRightGroup: {
      marginLeft: 'auto',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 30,
    },
    cardIcons: {
      width: 24,
      height: 24,
    },
    shareIcon: {
      height: 20,
      width: 20,
    },
  });

  return (
    <View style={styles.cardDetailsRow}>
      <View style={styles.cardDetailsRowLeftGroup}>
        <Image source={icons.cardClock} style={styles.cardIcons} />
        <Text style={styles.timeStamp}>
          {timeToPresent(new Date(data.PublishedDate))}
        </Text>
      </View>
      <View style={styles.cardDetailsRowRightGroup}>
        <TouchableOpacity
          onPress={handleShare}
          hitSlop={{bottom: 20, left: 20, top: 20, right: 15}}>
          <Image source={icons.cardShare} style={styles.shareIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleBookmark}
          hitSlop={{bottom: 10, left: 10, top: 10, right: 10}}>
          {bookmarked ? (
            <Image source={icons.cardBookmarkActive} style={styles.cardIcons} />
          ) : (
            <Image source={icons.cardBookmark} style={styles.cardIcons} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(CardDetails);
