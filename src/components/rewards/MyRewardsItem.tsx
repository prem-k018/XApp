import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';
import screensUtils from '@app/utils/screensUtils';
import {icons} from '@app/assets/icons';
import RenderHTML from 'react-native-render-html';
import {IssuedReward} from '@app/model/rewards/issuedRewardList';
import getRewardDetails from '@app/services/rewards/rewardDetails';
import {RewardDetails} from '@app/model/rewards/rewardDetails';
import Clipboard from '@react-native-clipboard/clipboard';
import {getContentIcon} from '@app/utils/HelperFunction';

export type Props = {
  data: IssuedReward;
  index: number;
  usedReward?: boolean;
};

const MyRewardsItem: React.FC<Props> = ({data, index, usedReward}) => {
  const {appConfigData} = useAppContext();
  const [viewDetails, setViewDetails] = useState<boolean>(false);
  const [rewardData, setRewardData] = useState<RewardDetails>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [expired, setExpired] = useState<boolean>(false);
  const [codeCopied, setCodeCopied] = useState<boolean>(true);

  const screenWidth = screensUtils.screenWidth;
  const containerWidth =
    screenWidth - (theme.cardMargin.left + theme.cardMargin.right);

  useEffect(() => {
    getRewardDetailsData();
  }, []);

  const activeTo = data?.issued_coupon?.active_to;
  useEffect(() => {
    const checkExpiration = () => {
      if (!activeTo) {
        setExpired(false);
        return;
      }

      const activeToDate = new Date(activeTo);
      const currentDate = new Date();

      if (isNaN(activeToDate.getTime())) {
        console.log('Invalid active_to date:', activeTo);
        setExpired(false);
        return;
      }

      setExpired(activeToDate < currentDate);
    };
    checkExpiration();
  }, [activeTo]);

  const handleViewDetailsToggle = () => {
    if (!expired) {
      setViewDetails(prev => !prev);
    }
  };

  const getRewardDetailsData = async () => {
    setIsLoading(true);
    try {
      const rewardId = data.reward_id;
      const contents = await getRewardDetails(rewardId);
      if (contents?.data?.users_getRewardDetails) {
        const newData = contents.data.users_getRewardDetails;
        setRewardData(newData);
        setIsLoading(false);
      } else {
        setIsError('Something went wrong!');
      }
    } catch (error: any) {
      setIsError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!expired) {
      Clipboard.setString(data?.issued_coupon?.coupon_code);
      console.log(
        'Copied to clipboard',
        `Your Coupon code: ${data?.issued_coupon?.coupon_code}`,
      );
      setCodeCopied(false);
      setTimeout(() => {
        setCodeCopied(true);
      }, 2000);
    }
  };

  const imageSource = rewardData?.images?.[0]?.image;

  const styles = StyleSheet.create({
    container: {
      paddingVertical: theme.cardPadding.mediumSize,
      paddingHorizontal: theme.cardPadding.defaultPadding,
      borderWidth: theme.border.borderWidth,
      borderRadius: theme.border.borderRadius,
      borderColor: theme.colors.grayScale4,
      width: containerWidth,
      overflow: 'hidden',
    },
    topView: {
      flexDirection: 'row',
      gap: theme.cardPadding.smallXsize,
      justifyContent: 'space-between',
    },
    imageView: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 40,
      width: 40,
    },
    image: {
      height: '100%',
      width: '100%',
    },
    itemDivider: {
      backgroundColor: theme.colors.grayScale4,
      width: 1.5,
    },
    pointsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 8,
      paddingVertical: 2,
      gap: 4,
      borderRadius: theme.cardPadding.mediumSize,
      backgroundColor: expired ? 'rgba(0, 0, 0, 0.1)' : theme.colors.grayScale4,
      alignItems: 'center',
      alignSelf: 'center',
    },
    pointText: {
      fontFamily: theme.fonts.Inter.regular,
      fontSize: theme.fontSize.font12,
      color: expired ? theme.colors.lightGray : theme.colors.primaryBlack,
    },
    expiryDate: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      fontSize: theme.fontSize.font12,
      color: expired ? theme.colors.red : theme.colors.lightGray,
      alignSelf: 'center',
    },
    rewardName: {
      fontFamily: theme.fonts.HCLTechRoobert.medium,
      fontSize: theme.fontSize.font20,
      color: expired
        ? theme.colors.lightGray
        : appConfigData?.secondary_text_color,
      marginTop: 8,
    },
    couponCodeView: {
      marginTop: theme.cardMargin.top,
      backgroundColor: '#EDEDED',
      height: 40,
      borderRadius: theme.border.borderRadius,
      borderWidth: theme.border.borderWidth,
      borderColor: theme.colors.grayScale7,
      borderStyle: 'dashed',
      justifyContent: 'center',
      paddingHorizontal: theme.cardPadding.defaultPadding,
    },
    buttonView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.cardPadding.mediumSize,
    },
    button: {
      borderRadius: theme.border.borderRadius,
      backgroundColor:
        usedReward || expired
          ? theme.colors.Grayscale
          : theme.colors.primaryBlack,
      paddingVertical: theme.cardPadding.smallXsize,
      width: '48%',
    },
    buttonInActive: {
      borderRadius: theme.border.borderRadius,
      borderWidth: theme.border.borderWidth,
      paddingVertical: theme.cardPadding.smallXsize,
      borderColor: expired
        ? theme.colors.Grayscale
        : appConfigData?.secondary_text_color,
      width: '48%',
    },
    buttonInText: {
      fontFamily: theme.fonts.HCLTechRoobert.semiBold,
      fontSize: theme.fontSize.font14,
      color:
        usedReward || expired
          ? theme.colors.grayScale3
          : appConfigData?.primary_text_color,
      textAlign: 'center',
    },
    buttonText: {
      fontFamily: theme.fonts.HCLTechRoobert.semiBold,
      fontSize: theme.fontSize.font14,
      color: expired
        ? theme.colors.grayScale3
        : appConfigData?.secondary_text_color,
      textAlign: 'center',
    },
    divider: {
      borderBottomWidth: theme.border.borderWidth,
      borderBlockColor: theme.colors.grayScale4,
      marginVertical: theme.cardPadding.mediumSize,
      marginHorizontal: -theme.cardPadding.defaultPadding,
    },
    detailsHeading: {
      fontFamily: theme.fonts.HCLTechRoobert.medium,
      fontSize: theme.fontSize.font16,
      color: expired
        ? theme.colors.lightGray
        : appConfigData?.secondary_text_color,
    },
    detailContainer: {
      flexDirection: 'row',
      gap: 5,
      marginLeft: 8,
    },
    details: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <View style={styles.topView}>
          {isLoading ? (
            <View style={styles.imageView}>
              <ActivityIndicator
                size="small"
                color={appConfigData?.primary_color}
              />
            </View>
          ) : (
            <View style={styles.imageView}>
              {imageSource ? (
                <Image
                  source={{uri: rewardData?.images[0].image}}
                  style={styles.image}
                />
              ) : (
                <Image source={icons.rewardFallback} />
              )}
            </View>
          )}
          <View style={styles.itemDivider}></View>
          <View style={styles.pointsContainer}>
            <Image source={getContentIcon(data?.issued_coupon?.value_type)} />
            <Text style={styles.pointText}>{data?.issued_coupon?.value}</Text>
          </View>
        </View>
        {usedReward ? (
          <>
            {data?.issued_coupon?.used_at && (
              <Text
                style={[styles.expiryDate, {color: theme.colors.red}]}
                numberOfLines={1}>
                Used on : {data?.issued_coupon?.used_at?.split('T')[0]}
              </Text>
            )}
          </>
        ) : (
          <>
            {data?.issued_coupon?.active_to && (
              <Text style={styles.expiryDate}>
                Expires : {data?.issued_coupon?.active_to?.split('T')[0]}
              </Text>
            )}
          </>
        )}
      </View>
      <Text style={styles.rewardName}>{data?.reward_name}</Text>
      {rewardData?.rewards_desc && (
        <DetailsItem text={rewardData?.rewards_desc} />
      )}
      <View style={styles.couponCodeView}>
        <Text style={styles.detailsHeading} numberOfLines={1}>
          Code : {data?.issued_coupon?.coupon_code}
        </Text>
      </View>
      <View style={styles.buttonView}>
        <TouchableOpacity
          style={styles.button}
          disabled={usedReward && true}
          activeOpacity={1}
          onPress={copyToClipboard}>
          <Text style={styles.buttonInText}>
            {usedReward ? 'Applied' : codeCopied ? 'Copy Code' : 'Copied!'}
          </Text>
        </TouchableOpacity>
        {rewardData?.brand_name ||
        rewardData?.brand_description ||
        rewardData?.conditions_description ||
        rewardData?.usage_instruction ? (
          <TouchableOpacity
            style={[viewDetails ? styles.button : styles.buttonInActive]}
            activeOpacity={1}
            onPress={handleViewDetailsToggle}>
            <Text
              style={[viewDetails ? styles.buttonInText : styles.buttonText]}>
              {viewDetails ? 'Hide Details' : 'View Details'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.buttonInActive, {borderColor: '#A0A3BD'}]}>
            <Text style={[styles.buttonText, {color: '#A0A3BD'}]}>
              View Details
            </Text>
          </View>
        )}
      </View>
      {viewDetails && (
        <View style={{flex: 1}}>
          <View style={styles.divider} />
          <Text style={styles.detailsHeading}>Details</Text>
          {rewardData?.brand_name && (
            <DetailsItem text={rewardData?.brand_name} />
          )}
          {rewardData?.brand_description !== '' && (
            <DetailsItem text={rewardData?.brand_description} />
          )}
          {rewardData?.conditions_description !== '' && (
            <DetailsItem text={rewardData?.conditions_description} />
          )}
          {rewardData?.usage_instruction !== '' && (
            <DetailsItem text={rewardData?.usage_instruction} />
          )}
        </View>
      )}
    </View>
  );
};

export default MyRewardsItem;

const DetailsItem = React.memo(({text}: any) => {
  const {appConfigData} = useAppContext();
  const {width} = useWindowDimensions();
  const dynamicFontFamily = theme.fonts.HCLTechRoobert.regular;
  const dynamicColor = appConfigData?.secondary_text_color;
  const fontSize = theme.fontSize.font14;
  const lineHeight = 20;

  const tagsStyles = useMemo(
    () => ({
      p: {
        margin: 0,
        padding: 0,
      },
    }),
    [],
  );

  const htmlContent = useMemo(
    () => `
      <div style="font-family: '${dynamicFontFamily}'; color: ${dynamicColor}; font-size: ${fontSize}px; line-height: ${lineHeight}px">
        ${text}
      </div>
      <style>
        div { height: auto !important; }
        img { max-width: 100%; height: auto !important; }
        video { max-width: 100%; height: auto !important; }
      </style>
    `,
    [dynamicFontFamily, dynamicColor, fontSize, lineHeight, text],
  );

  const contentWidth = useMemo(() => width - 70, [width]);

  return (
    <RenderHTML
      source={{html: htmlContent}}
      tagsStyles={tagsStyles}
      contentWidth={contentWidth}
      enableExperimentalBRCollapsing={false}
    />
  );
});
