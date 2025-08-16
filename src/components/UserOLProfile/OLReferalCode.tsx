import {
  ActivityIndicator,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';
import {images} from '@app/assets/images';
import {icons} from '@app/assets/icons';
import Clipboard from '@react-native-clipboard/clipboard';
import StorageService from '@app/utils/storageService';
import {globalSettingData} from '@app/constants/constants';
import FavouriteCarousel from '../carousels/favouriteCarousel';
import {MyStory} from '@app/model/myStories';

export type Props = {
  referalCode: string;
  spinLoading: boolean;
  spinWheelData: MyStory[];
};

const OLReferalCode: React.FC<Props> = ({
  referalCode,
  spinLoading,
  spinWheelData,
}) => {
  const {appConfigData} = useAppContext();
  const [codeCopied, setCodeCopied] = useState<boolean>(true);
  const [loyaltyText, setLoyaltyText] = useState<string>('');

  useEffect(() => {
    getGlobalSettingsData();
  }, []);

  const SpinWheelCarousal = () => {
    if (spinLoading) {
      return (
        <View style={{paddingVertical: 20, alignItems: 'center'}}>
          <ActivityIndicator
            size="large"
            color={appConfigData?.primary_color}
          />
        </View>
      );
    }

    if (spinWheelData?.length > 0) {
      return (
        <FavouriteCarousel
          data={spinWheelData}
          inUserProfile={true}
          spinWheel={true}
        />
      );
    } else {
      return null;
    }
  };

  const getGlobalSettingsData = async () => {
    try {
      const data = await StorageService.getData(globalSettingData);
      const contents = JSON.parse(data as any) || {};
      const text = contents?.loyalty_explained_text;
      setLoyaltyText(text);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(referalCode);
    console.log('Copied to clipboard', `Your referral code: ${referalCode}`);
    setCodeCopied(false);
    setTimeout(() => {
      setCodeCopied(true);
    }, 2000);
  };

  const handleShare = (platform: string) => {
    const shareText = `Check out my referral code: ${referalCode}`;
    let url = '';

    switch (platform) {
      case 'facebook':
        url = `fb://facewebmodal/f?href=https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareText,
        )}`;
        break;
      case 'linkedin':
        url = `linkedin://shareArticle?mini=true&url=${encodeURIComponent(
          shareText,
        )}`;
        break;
      case 'twitter':
        url = `twitter://post?message=${encodeURIComponent(shareText)}`;
        break;
      default:
        console.warn('Unsupported platform');
        return;
    }

    console.log('Constructed URL:', url); // Debugging log

    // Check if the URL can be opened
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url).catch(err =>
            console.error('Failed to open URL:', err),
          );
        } else {
          console.log(
            `${platform} app is not installed, opening in web browser.`,
          );
          // Fallback URL to share on web
          let fallbackUrl = '';
          switch (platform) {
            case 'facebook':
              fallbackUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                shareText,
              )}`;
              break;
            case 'linkedin':
              fallbackUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                shareText,
              )}`;
              break;
            case 'twitter':
              fallbackUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                shareText,
              )}`;
              break;
            default:
              break;
          }
          // Open fallback URL in web browser
          Linking.openURL(fallbackUrl).catch(err =>
            console.error('Failed to open fallback URL:', err),
          );
        }
      })
      .catch(err => console.error('Error checking URL support:', err));
  };

  const styles = StyleSheet.create({
    container: {
    },
    referralCardContainer: {
      marginHorizontal: theme.cardMargin.left,
      marginBottom: theme.cardPadding.carMargin,
      backgroundColor: '#DEF5D9',
      gap: theme.cardPadding.carMargin,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.cardPadding.defaultPadding,
    },
    text: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font20,
      color: appConfigData?.secondary_text_color,
      textAlign: 'center',
    },
    desc: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font12,
      color: theme.colors.grayScale3,
      textAlign: 'center',
    },
    codeContainer: {
      flexDirection: 'row',
    },
    dashBorder: {
      borderStyle: 'dashed',
      borderWidth: theme.border.borderWidth,
      borderColor: theme.colors.blue,
      borderRadius: theme.border.borderRadius,
      width: '65%',
      backgroundColor: 'transparent',
    },
    innerContainer: {
      backgroundColor: '#F3FAFF',
      borderRadius: theme.border.borderRadius,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
    },
    referalCodeText: {
      fontFamily: theme.fonts.DMSans.semiBold,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
      textAlign: 'center',
    },
    copyCodeText: {
      fontFamily: theme.fonts.DMSans.semiBold,
      fontSize: theme.fontSize.font14,
      color: codeCopied
        ? appConfigData?.secondary_text_color
        : appConfigData?.primary_text_color,
      marginLeft: '-6%',
      textAlign: 'center',
      width: '35%',
      paddingVertical: 8,
      borderRadius: theme.border.borderRadius,
      borderWidth: theme.border.borderWidth,
      borderColor: appConfigData?.secondary_text_color,
      backgroundColor: codeCopied
        ? appConfigData?.background_color
        : appConfigData?.secondary_text_color,
    },
    shareContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.cardPadding.smallXsize,
    },
    headingText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.secondary_text_color,
      marginHorizontal: theme.cardMargin.left,
    },
    headingDesc: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.grayScale7,
      marginTop: theme.cardPadding.carMargin / 2,
      marginBottom: theme.cardPadding.carMargin,
      marginHorizontal: theme.cardMargin.left,
    },
    buttonText: {
      marginHorizontal: theme.cardMargin.left,
      backgroundColor: appConfigData?.primary_color,
      paddingVertical: theme.cardPadding.defaultPadding,
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.primary_text_color,
      borderRadius: theme.border.borderRadius,
      textAlign: 'center',
      marginBottom: 30,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.referralCardContainer}>
        <Image source={images.referalCodeImage} />
        <View>
          <Text style={styles.text}>Share and get 300 Points</Text>
          <Text style={styles.desc}>
            Refer your Friend and get 200 Loyalty points each on their first
            transaction
          </Text>
        </View>
        <View style={styles.codeContainer}>
          <View style={styles.dashBorder}>
            <View style={styles.innerContainer}>
              <Text style={styles.referalCodeText}>{referalCode}</Text>
            </View>
          </View>
          <Text
            style={styles.copyCodeText}
            onPress={() => {
              codeCopied && copyToClipboard();
            }}>
            {!codeCopied ? 'Copied!' : 'Copy Code'}
          </Text>
        </View>
        <View style={styles.shareContainer}>
          <Text style={styles.desc}>Share Via:</Text>
          <TouchableOpacity
            activeOpacity={1}
            hitSlop={{bottom: 20, left: 20, top: 20, right: 5}}
            onPress={() => handleShare('facebook')}>
            <Image source={icons.facebookIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            hitSlop={{bottom: 10, left: 5, top: 10, right: 10}}
            onPress={() => handleShare('twitter')}>
            <Image source={icons.twitterIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            hitSlop={{bottom: 20, left: 5, top: 20, right: 5}}
            onPress={() => handleShare('linkedin')}>
            <Image source={icons.linkedinIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <SpinWheelCarousal />
      <Text style={styles.headingText}>How it Works</Text>
      <Text style={styles.headingDesc}>{loyaltyText}</Text>
      <Text style={styles.buttonText}>Know More</Text>
    </View>
  );
};

export default OLReferalCode;
