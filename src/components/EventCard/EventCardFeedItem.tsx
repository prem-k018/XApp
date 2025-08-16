/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {memo} from 'react';
import Share from 'react-native-share';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';
import {icons} from '@app/assets/icons';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {timeToPresent} from '@app/utils/dateUtils';
import {getDayMonth} from '@app/utils/HelperFunction';
import {shareURL} from '@app/utils/imageLinkUtils';
import ScreenNames from '@app/constants/screenNames';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CardTypes from '@app/components/cards/cardTypes';

const EventCardFeedItem = ({item}: any) => {
  const {appConfigData} = useAppContext();

  const dynamicText = item.description;
  const dynamicFontFamily = theme.fonts.Inter.regular;
  const dynamicColor = appConfigData?.secondary_text_color;
  const fontSize = theme.fontSize.font16;
  const lineHeight = 24.5;
  const htmlContent = `
    <div style="font-family: '${dynamicFontFamily}'; color: ${dynamicColor}; font-size: ${fontSize}px; line-height: ${lineHeight}px; 
  }px">
      ${dynamicText}
    </div>
    <style> div {height: auto !important}
            img { max-width: 100%; height: auto !important; }
            video { max-width: 100%; height: auto !important;}

            </style>
  `;

  const {width} = useWindowDimensions();

  const contentType =
    item.item_path &&
    item.item_path.length > 0 &&
    item.item_path[0].content_type !== undefined
      ? item.item_path[0]?.content_type.toString()
      : 'undefined';

  const url =
    item.item_path && item.item_path.length > 0 && item.item_path[0].path;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const openLink = () => {
    if (contentType === 'undefined' && url === undefined) {
      return;
    }

    switch (contentType) {
      case CardTypes.Article:
        navigation?.navigate(ScreenNames.articleDetails, {
          data: {
            Id: url,
          },
        });
        break;

      case CardTypes.Poll:
        navigation?.navigate(ScreenNames.poll, {
          data: {
            Id: url,
          },
        });
        break;
      case CardTypes.Quiz:
        navigation?.navigate(ScreenNames.quiz, {
          data: {
            Id: url,
          },
        });
        break;
      case CardTypes.EventDetails:
        navigation?.navigate(ScreenNames.eventDetails, {
          data: {
            Id: url,
          },
        });
        break;
      default:
        break;
    }
  };

  const shareFn = async (url: string) => {
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

  const styles = StyleSheet.create({
    container: {
      gap: 24,
    },
    content: {
      flexDirection: 'row',
      gap: 20,
    },
    time: {
      color: appConfigData?.secondary_text_color,
      fontSize: theme.fontSize.font12,
      fontFamily: theme.fonts.Inter.semiBold,
    },
    date: {
      color: theme.colors.lightGray,
      fontSize: theme.fontSize.font12,
      fontFamily: theme.fonts.Inter.regular,
    },
    rightContent: {
      gap: 12,
    },
    title: {
      color: theme.colors.grayScale3,
      fontSize: theme.fontSize.font12,
      fontFamily: theme.fonts.Inter.semiBold,
      marginRight: 32,
    },
    shareIcon: {
      height: 18,
      width: 18,
      position: 'absolute',
      top: 0,
      right: 0,
    },
    webview: {flex: 1},
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View>
          <Text style={styles.time}>
            {timeToPresent(new Date(item.last_published_date))} ago
          </Text>
          <Text style={styles.date}>
            {getDayMonth(item.last_published_date)}
          </Text>
        </View>
        <View style={styles.rightContent}>
          <Text style={styles.title}>{item.title}</Text>
          <TouchableOpacity onPress={openLink} activeOpacity={1}>
            <AutoHeightWebView
              source={{html: htmlContent}}
              style={{
                width: width - 116,
                opacity: 0.99,
                overflow: 'hidden',
                flex: 1,
              }}
              containerStyle={styles.webview}
              scrollEnabled={false}
            />
          </TouchableOpacity>
        </View>
        {contentType !== 'undefined' && url !== undefined && (
          <TouchableOpacity onPress={handleShare} style={styles.shareIcon}>
            <Image source={icons.articleShare} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default memo(EventCardFeedItem);
