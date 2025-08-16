import {icons} from '@app/assets/icons';
import {theme} from '@app/constants';
import {useAppContext} from '@app/store/appContext';
import screensUtils from '@app/utils/screensUtils';
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
} from 'react-native';
import CardTypes from '../cards/cardTypes';
import {buildQueryString} from '@app/utils/notificationsHelper';
import DeepLinkManager from '@app/deeplinks/deeplinkManager';
import {capitalizeFirstLetter} from '@app/utils/HelperFunction';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

interface NotificationPopupProps {
  visible: boolean;
  notificationContent: any;
  contentType: string;
  onClose?: () => void;
  multipleItem: boolean;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  visible,
  contentType,
  notificationContent,
  onClose,
  multipleItem,
}) => {
  const {appConfigData} = useAppContext();
  const screenWidth = screensUtils.screenWidth;
  const containerWidth = screenWidth - (28.5 + 28.5);
  const buttonWidth = (containerWidth - (35 + 35 + 35)) / 2;
  const topButtonWidth = containerWidth - 50;
  const notificationData = [
    {
      contentImage:
        'https://s3-alpha-sig.figma.com/img/c334/2a04/559e4afb80d471280ddb6685352f029d?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=UHfU7A~1g2a1944dpis76Jl5xVCJIS0r2Id25xO8kpMbLpGsrQIg7ebeldXEdlFQtCiGuletgEUZ4OySHGw0as97ZSQDnnmuFdxybhjgRQKgB3i7uBWUwVGsGnWjFwC40jccFtWL7m5VIB1-RIlTxzl19sVDdzgyQIfT1vmva3XszPivCiVnDK4O9OcznOwqvC-I93XEeChQNSePGdeQ9FCysw2WYz3UnXJh~zVQgHO3CmRKJZ4kVQaHMgtf-IqY-UzdZubBGmTvSQQcPuoZbYLAPe8T-FmPeQgoM1fJth7jRqGBVBa0hTxSL1NQ2k-mWRVVz6PG9KXdt7LoXLOMcQ__',
      title: 'KEEP AN EYE ON THE STADIUM',
      description:
        'Watch sports live or highlights, read every news from your smartphone',
      contentType: 'Article',
    },
    {
      contentImage:
        'https://s3-alpha-sig.figma.com/img/2ff1/ed1d/2b2f696181653a5592af125e3bde7633?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RxScu7AehrdoyB1bqhnMWaEcFQ1kWbKZno3Sn09AHtdeg9nC23nE3yS6IOF2QLGvaGSnBKqADj7z-mdV4jTYJuTKEemBR8dQQiVRP3asr42Y9rQ8rPL81hhmvbvkACFY8vKy~ftyMh9YyQtL5GERhCxxCg5PUMQ4mGSYXtUOn-m2IzKkqfaEtw0u-DdiA3KLNc~fp9zgRz7VGgPD5i2D4cjhlvJz01v8allxdXbD1khpSnvoR0E~XlIUbf2I4xFe9rCg87ixXlISQAwT4I5slMwEKt1LUolIqLY06T9NR3uJq6loAHZW2o6ugBFD2ba3FZvE-UkelgLTBbM9pF85kg__',
      title: 'KEEP AN EYE ON THE STADIUM',
      description:
        'Watch sports live or highlights, read every news from your smartphone',
      contentType: 'Article',
    },
    {
      contentImage:
        'https://s3-alpha-sig.figma.com/img/adc8/54a7/8bf9adf2513341b4adf200a730eda972?Expires=1730073600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=DsNr66-M0~m327pB2BTk9iqaqhJnaNRvsZtHT2xxceXayZ0XVTShviNl8OfQiaoDhmDc7Cvz3vX7hWy3Fq9sSUiVPvMFJixamT0FfZPYb3RT5I5QSssc-lt0XgmfyD2fEL7WP0UF7Fmj3Xi8KUrqJLrlNsrAAHViezml5Mrz6VDGPig6p1M-DlVAZ7ljANAEDSkLdgBEBqOs1sxowm9Gzm9gLUmtpMT7VEM4ihgUaB8rx7GI9-D28Y28RUFXeq83jQVvt-ZPogawFRSD-9POxd4xAdV5Yicq8xepv4JVRll~XISdSzUTlI78Ukf718LQyGYXW2xE5E2wtCnS3Bp05g__',
      title: 'KEEP AN EYE ON THE STADIUM',
      description:
        'Watch sports live or highlights, read every news from your smartphone',
      contentType: 'Vod',
    },
  ];

  const styles = StyleSheet.create({
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    notificationCard: {
      width: containerWidth,
      backgroundColor: appConfigData?.primary_text_color,
      paddingTop: 36,
      paddingBottom: 30,
      paddingHorizontal: 24,
      alignItems: 'center',
      gap: theme.cardPadding.mediumSize,
    },
    circle: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 76.25,
      width: 76.25,
      borderRadius: 76.25 / 2,
      backgroundColor: appConfigData?.background_color,
      position: 'absolute',
      top: -76.25 / 2,
    },
    innerCircle: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 58,
      width: 58,
      borderRadius: 58 / 2,
      backgroundColor: appConfigData?.primary_color,
    },
    icon: {
      width: 24,
      height: 24,
    },
    contentTypeText: {
      fontSize: theme.fontSize.font14,
      fontFamily: theme.fonts.DMSans.medium,
      color: theme.colors.grayScale7,
      textAlign: 'center',
    },
    title: {
      fontSize: theme.fontSize.font28,
      fontFamily: theme.fonts.DMSans.regular,
      color: appConfigData?.secondary_text_color,
      textAlign: 'center',
    },
    divider: {
      borderBottomColor: theme.colors.grayScale4,
      borderBottomWidth: theme.border.borderWidth,
      width: '100%',
    },
    description: {
      fontSize: theme.fontSize.font16,
      fontFamily: theme.fonts.DMSans.medium,
      color: appConfigData?.secondary_text_color,
      textAlign: 'center',
    },
    buttonView: {
      marginTop: theme.cardPadding.smallXsize,
      paddingVertical: 10,
      paddingHorizontal: theme.cardMargin.left,
      borderRadius: theme.border.borderRadius,
    },
    buttonText: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font18,
      color: appConfigData?.primary_text_color,
      alignSelf: 'center',
      textAlign: 'center',
    },
    leftTriangle: {
      alignSelf: 'center',
      width: 12,
      height: 45,
      marginRight: -1,
    },
    rightTriangle: {
      alignSelf: 'center',
      width: 12,
      height: 45,
      marginLeft: -1,
      transform: [{rotate: '180deg'}],
    },
    radioLine: {
      flexDirection: 'row',
      width: topButtonWidth,
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    bottomlable: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    trackContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    filledTrack: {
      height: 4,
      backgroundColor: appConfigData?.primary_color,
      width: '50%',
    },
    unfilledTrack: {
      height: 4,
      backgroundColor: theme.colors.grayScale2,
      flex: 1,
    },
    thumb: {
      position: 'absolute',
      left: '50%',
      width: 16,
      height: 16,
      backgroundColor: '#FF5A5A',
      borderRadius: 8,
      top: -6,
    },
    lable: {
      fontSize: theme.fontSize.font12,
      fontFamily: theme.fonts.DMSans.medium,
      color: appConfigData?.secondary_text_color,
    },
    topic: {
      fontSize: theme.fontSize.font28,
      fontFamily: theme.fonts.DMSans.bold,
      color: appConfigData?.secondary_text_color,
    },
    subTopic: {
      fontSize: theme.fontSize.font14,
      fontFamily: theme.fonts.DMSans.regular,
      color: theme.colors.grayScale7,
    },
    itemContainer: {
      flexDirection: 'row',
      gap: theme.cardPadding.mediumSize,
    },
    image: {
      height: 90,
      width: 90,
    },
    rightSide: {
      flex: 1,
    },
    itemTitle: {
      fontSize: theme.fontSize.font20,
      fontFamily: theme.fonts.DMSans.regular,
      color: appConfigData?.secondary_text_color,
    },
    itemSubTitle: {
      fontSize: theme.fontSize.font12,
      fontFamily: theme.fonts.DMSans.regular,
      color: theme.colors.grayScale7,
    },
    icons: {
      height: 20,
      width: 20,
      position: 'absolute',
      top: '38%',
      left: '38%',
    },
    gradient: {
      flex: 1,
      position: 'absolute',
      height: '100%',
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  });

  const Icon = () => {
    switch (contentType) {
      case CardTypes.EventDetails:
        return <Image source={icons.eventType} style={styles.icon} />;
      case CardTypes.Article:
        return <Image source={icons.articleType} style={styles.icon} />;
      case CardTypes.Video:
        return <Image source={icons.alertInfo} style={styles.icon} />;
      default:
        return <Image source={icons.alertInfo} style={styles.icon} />;
    }
  };

  const Button = ({color, text, onPress, width}: any) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={[styles.buttonView, {backgroundColor: color, width: width}]}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );

  const ContentButton = () => {
    const handleConfirmButton = () => {
      if (onClose) {
        onClose();
        const baseUrl = `platformx://${contentType?.toLowerCase()}`;
        const queryParams = {
          userid:
            contentType === CardTypes.Video
              ? notificationContent?.data?.data?.id
              : notificationContent?.data?.data?.Id,
        };
        const queryString = buildQueryString(queryParams);
        const url = `${baseUrl}?${queryString}`;
        DeepLinkManager.getInstance().handleDeepLink({url});
      }
    };

    switch (contentType) {
      case CardTypes.EventDetails:
        return (
          <>
            <Button
              onPress={handleConfirmButton}
              width={topButtonWidth}
              color={
                !notificationContent?.isEventLive &&
                !notificationContent?.isEventExpired
                  ? appConfigData?.secondary_text_color
                  : notificationContent?.isEventLive &&
                    !notificationContent?.isEventExpired
                  ? appConfigData?.primary_color
                  : appConfigData?.primary_color
              }
              text={
                !notificationContent?.isEventLive &&
                !notificationContent?.isEventExpired
                  ? 'EVENT START IN 5 MINS'
                  : notificationContent?.isEventLive &&
                    !notificationContent?.isEventExpired
                  ? 'Join the Event!'
                  : 'View Event'
              }
            />
            <Button
              width={topButtonWidth}
              onPress={onClose}
              color={theme.colors.grayScale7}
              text={
                notificationContent?.isEventLive ||
                !notificationContent?.isEventExpired
                  ? 'DECLINE'
                  : 'CANCEL'
              }
            />
          </>
        );
      case CardTypes.Article:
        return (
          <>
            <Button
              width={topButtonWidth}
              onPress={handleConfirmButton}
              color={appConfigData?.primary_color}
              text={'View Article'.toUpperCase()}
            />
            <Button
              width={topButtonWidth}
              onPress={onClose}
              color={theme.colors.grayScale7}
              text={'Cancel'.toUpperCase()}
            />
          </>
        );
      case CardTypes.Video:
        return (
          <>
            <Button
              width={topButtonWidth}
              onPress={handleConfirmButton}
              color={appConfigData?.primary_color}
              text={'View Video'.toUpperCase()}
            />
            <Button
              width={topButtonWidth}
              onPress={onClose}
              color={theme.colors.grayScale7}
              text={'Cancel'.toUpperCase()}
            />
          </>
        );
      case CardTypes.PlayerProfile:
        return (
          <>
            <Button
              width={topButtonWidth}
              onPress={handleConfirmButton}
              color={appConfigData?.primary_color}
              text={'View Profile'.toUpperCase()}
            />
            <Button
              width={topButtonWidth}
              onPress={onClose}
              color={theme.colors.grayScale7}
              text={'Cancel'.toUpperCase()}
            />
          </>
        );
      default:
      case CardTypes.EventDetails:
        return (
          <>
            <Button
              width={topButtonWidth}
              onPress={() => console.log('Event is Pressed')}
              color={appConfigData?.primary_color}
              text={'Event Start in 5 mins'.toUpperCase()}
            />
            <Button
              width={topButtonWidth}
              onPress={onClose}
              color={theme.colors.grayScale7}
              text={'Decline'.toUpperCase()}
            />
          </>
        );
    }
  };

  const StaticSliderDesign = () => {
    return (
      <View>
        <View style={styles.radioLine}>
          <View style={styles.trackContainer}>
            <View style={styles.filledTrack} />
            <View style={styles.unfilledTrack} />
            <View style={styles.thumb} />
          </View>
        </View>
        <View style={styles.bottomlable}>
          <Text style={styles.lable}>0 Min</Text>
          <Text style={[styles.lable, {position: 'absolute', left: '48%'}]}>
            You
          </Text>
          <Text style={styles.lable}>15 Min</Text>
        </View>
      </View>
    );
  };

  const MultipleData = () => {
    return (
      <View style={[styles.notificationCard, {alignItems: 'flex-start'}]}>
        <View>
          <Text style={styles.topic}>YOU MAKE LIKE THIS</Text>
          <Text style={styles.subTopic}>Based on your interest</Text>
        </View>
        {notificationData.map((item: any, index: number) => (
          <View key={index} style={styles.itemContainer}>
            <FastImage
              style={styles.image}
              source={{
                uri: item.contentImage,
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}>
              {item.contentType === CardTypes.Video && (
                <View style={styles.gradient}>
                  <Image source={icons.videoPlay} style={styles.icons} />
                </View>
              )}
            </FastImage>
            <View style={styles.rightSide}>
              <Text style={styles.itemTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.itemSubTitle} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          </View>
        ))}
        <View style={styles.itemContainer}>
          <Button
            onPress={() => console.log('View All')}
            color={appConfigData?.primary_color}
            width={buttonWidth}
            text={'View All'}
          />
          <Button
            onPress={onClose}
            width={buttonWidth}
            color={theme.colors.grayScale7}
            text={'CANCEL'}
          />
        </View>
      </View>
    );
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        {multipleItem ? (
          <MultipleData />
        ) : (
          <View style={styles.notificationCard}>
            <View style={styles.circle}>
              <View style={styles.innerCircle}>
                <Icon />
              </View>
            </View>
            <View>
              <Text style={styles.contentTypeText}>
                {capitalizeFirstLetter(
                  contentType === CardTypes.Video ? 'Video' : contentType,
                )}
              </Text>
              <Text style={styles.title} numberOfLines={2}>
                {notificationContent?.title}
              </Text>
              {contentType ===
                (CardTypes.EventDetails || CardTypes.Article) && (
                <Text
                  style={[
                    styles.contentTypeText,
                    {fontSize: theme.fontSize.font12},
                  ]}>
                  {notificationContent?.time}
                </Text>
              )}
            </View>
            {contentType === (CardTypes.EventDetails || CardTypes.Article) && (
              <View style={styles.divider} />
            )}
            <Text style={styles.description} numberOfLines={3}>
              {notificationContent?.message}
            </Text>
            {/* {contentType === CardTypes.Video && <StaticSliderDesign />} */}
            <View>
              <ContentButton />
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default NotificationPopup;
