/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {Image, StyleSheet, View, TouchableOpacity} from 'react-native';
import Share from 'react-native-share';
import {icons} from '@app/assets/icons';
import LinearGradient from 'react-native-linear-gradient';
import {shareURL} from '@app/utils/imageLinkUtils';
import SafeAreaUtils from '@app/utils/safeAreaUtils';
import {theme} from '@app/constants';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useEffect, useState} from 'react';
import StorageService from '@app/utils/storageService';
import {bookmarkArray, button} from '@app/constants/constants';
import ScreenNames from '@app/constants/screenNames';
import { addEventForTracking } from '@app/services/tracking/rpiServices';

type BasicHeaderProps = {
  id: string;
  contentType: string;
  url: string;
};

const BasicHeader = ({id, contentType, url}: BasicHeaderProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const safeFrame = SafeAreaUtils.getSafeAreaFrame();
  const safeAreaInsets = SafeAreaUtils.getSafeAreaInsets();

  const [bookmarked, setBookmarked] = useState<boolean>(false);

  useEffect(() => {
    async function checkBookmarkStatus() {
      const bookmarks = await StorageService.getData(bookmarkArray);
      if (bookmarks) {
        const bookmarksObject = JSON.parse(bookmarks);
        if (bookmarksObject[id]) {
          setBookmarked(bookmarksObject[id]);
        } else {
          setBookmarked(false);
        }
        if (bookmarksObject.hasOwnProperty(id)) {
          setBookmarked(true);
        }
      }
    }

    checkBookmarkStatus();
  }, [bookmarked, id]);

  function handleBookmark() {
    const content = {ContentType: ScreenNames.homeScreen,screenType:button,button_name:"bookmark_header_button"};
    addEventForTracking(content);
    async function updateBookmark() {
      const bookmarks = await StorageService.getData(bookmarkArray);
      if (bookmarks) {
        const bookmarksObject = JSON.parse(bookmarks);
        if (bookmarked) {
          delete bookmarksObject[id];
          await StorageService.storeData(
            bookmarkArray,
            JSON.stringify(bookmarksObject),
          );
          setBookmarked(false);
        } else {
          bookmarksObject[id] = true;
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
            JSON.stringify({[id]: true}),
          );
          setBookmarked(true);
        }
      }
    }
    updateBookmark();
  }

  const shareFn = async (url: string) => {
    const content = {ContentType: ScreenNames.homeScreen,screenType:button,button_name:"share_header_button"};
    addEventForTracking(content);
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
    if (contentType !== '' && url !== '') {
      const urlToShare = shareURL(contentType, url);
      shareFn(urlToShare);
    }
  }
  return (
    <View
      style={[
        styles.container,
        {width: safeFrame.width, height: safeAreaInsets.top + 64},
      ]}>
      <LinearGradient
        start={{x: 0.0, y: 0}}
        end={{x: 0.0, y: 1}}
        colors={['#000000FF', '#00000000']}
        style={{flex: 1}}
      />
      <TouchableOpacity
        activeOpacity={1}
        onPress={navigation.goBack}
        style={[
          styles.iconStyle,
          styles.backButtonPositioning,
          {top: safeAreaInsets.top > 0 ? safeAreaInsets.top : 20},
        ]}>
        <Image source={icons.backwardArrow} />
      </TouchableOpacity>
      <View
        style={[
          styles.otherButtonsGroup,
          {top: safeAreaInsets.top > 0 ? safeAreaInsets.top : 20},
        ]}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleBookmark}
          style={styles.iconStyle}>
          <Image
            source={
              bookmarked ? icons.articleBookmarkActive : icons.articleBookmark
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleShare}
          style={styles.iconStyle}>
          <Image source={icons.articleShare} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
  },
  iconStyle: {
    height: 30,
    width: 30,
    backgroundColor: theme.colors.headerButtonBGColor,
    borderRadius: theme.border.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonPositioning: {
    position: 'absolute',
    left: theme.cardMargin.left,
  },
  otherButtonsGroup: {
    position: 'absolute',
    right: theme.cardMargin.right,
    flexDirection: 'row',
    gap: theme.cardPadding.defaultPadding,
  },
});

export default BasicHeader;
