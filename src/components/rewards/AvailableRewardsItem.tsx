import {
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
import {Reward} from '@app/model/rewards/rewardList';
import {icons} from '@app/assets/icons';
import RenderHTML from 'react-native-render-html';
import RedeemPopup from '../Popup/RedeemPopup';
import StatusPopup from '../Popup/StatusPopup';
import getAssignReward from '@app/services/rewards/redeemReward';
import StorageService from '@app/utils/storageService';
import {userMemberId} from '@app/constants/constants';

export type Props = {
  data: Reward;
  index: number;
};

const AvailableRewardsItem: React.FC<Props> = ({data, index}) => {
  const {appConfigData} = useAppContext();
  const [viewDetails, setViewDetails] = useState<boolean>(false);
  const [expired, setExpired] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [confirmPopup, setConfirmPopup] = useState<boolean>(false);
  const [message, setMessage] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);

  const screenWidth = screensUtils.screenWidth;
  const containerWidth =
    screenWidth - (theme.cardMargin.left + theme.cardMargin.right);

  const activeTo = data?.ends_at;
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

  const getRedemptionReward = async () => {
    try {
      setIsLoading(true);
      const rewardId = data?.reward_id;
      const memberId: any = await StorageService.getData(userMemberId);
      // const isPoints =
      //   data?.cost_in_points && data.cost_in_points > 0 ? false : true;
      const isPoints = false;
      const quantity = 1;
      const dateValid = data?.ends_at;
      const type = data?.reward_type;
      const contents = await getAssignReward(
        rewardId,
        memberId,
        isPoints,
        quantity,
        dateValid,
        type,
      );
      if (contents?.data?.users_assignRewards) {
        const newData = contents.data.users_assignRewards;
        setMessage({
          topic: 'Redemption Successful',
          message: newData.message,
          status: 'success',
        });
        setIsLoading(false);
      } else {
        const msg = contents.errors[0]?.message;
        setMessage({
          topic: 'Redemption Unsuccessful',
          message: msg,
          status: 'fail',
        });
      }
    } catch (error: any) {
      setIsError(error.message);
      setMessage({
        topic: 'Redemption Unsuccessful',
        message:
          'Oops! Something went wrong with your redemption. Please try again, or contact support if the issue persists.',
        status: 'fail',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getMessage = (msg: string) => {
    if (msg === 'success') {
      return 'Congratulations! Your redemption was successful. Enjoy your shopping experience!';
    } else if (msg === 'Not enough points') {
      return 'You don’t have enough points to redeem this offer. You need more points to complete the action.';
    } else if (msg === 'Limit per customer exceeded') {
      return 'You have exceeded the maximum usage limit for this coupon. Please  try another coupon.';
    } else {
      return 'Oops! Something went wrong with the redemption. Please try again or contact support if the issue persists.';
    }
  };

  const handleViewDetailsToggle = () => {
    setViewDetails(prev => !prev);
  };

  const handleRedeemption = () => {
    setVisible(false);
    getRedemptionReward();
    setConfirmPopup(true);
  };

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
      backgroundColor: expired ? '#FFEBEE' : theme.colors.grayScale4,
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
    buttonView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.cardPadding.mediumSize,
    },
    button: {
      borderRadius: theme.border.borderRadius,
      backgroundColor: expired
        ? theme.colors.Grayscale
        : theme.colors.primaryBlack,
      paddingVertical: theme.cardPadding.smallXsize,
      width: '48%',
    },
    buttonInActive: {
      borderRadius: theme.border.borderRadius,
      borderWidth: theme.border.borderWidth,
      paddingVertical: theme.cardPadding.smallXsize,
      width: '48%',
    },
    buttonInText: {
      fontFamily: theme.fonts.HCLTechRoobert.semiBold,
      fontSize: theme.fontSize.font14,
      color: expired
        ? theme.colors.grayScale3
        : appConfigData?.primary_text_color,
      textAlign: 'center',
    },
    buttonText: {
      fontFamily: theme.fonts.HCLTechRoobert.semiBold,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
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
          <View style={styles.imageView}>
            {data?.images[0]?.image.length > 0 ? (
              <Image
                source={{uri: data?.images[0]?.image}}
                style={styles.image}
              />
            ) : (
              <Image source={icons.rewardFallback} />
            )}
          </View>
          <View style={styles.itemDivider}></View>
          <View style={styles.pointsContainer}>
            <Image source={icons.loyaltyPointIcon} />
            <Text style={styles.pointText}>{data.cost_in_points} pts</Text>
          </View>
        </View>
        {data.ends_at && (
          <Text style={styles.expiryDate}>
            Expires : {data.ends_at.split('T')[0]}
          </Text>
        )}
      </View>
      <Text style={styles.rewardName}>{data.reward_name}</Text>
      {data.rewards_desc && <DetailsItem text={data.rewards_desc} />}
      <View style={styles.buttonView}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={1}
          onPress={() => setVisible(true)}>
          <Text style={styles.buttonInText}>Redeem</Text>
          {visible && (
            <RedeemPopup
              data={data}
              visible={visible}
              onClose={() => setVisible(false)}
              handleRedeem={handleRedeemption}
            />
          )}
          {confirmPopup && (
            <StatusPopup
              data={message}
              visible={confirmPopup}
              onClose={() => setConfirmPopup(false)}
              isLoading={isLoading}
            />
          )}
        </TouchableOpacity>
        {data?.brand_name ||
        data?.brand_description ||
        data?.conditions_description ||
        data?.usage_instruction ? (
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
          {data.brand_name && <DetailsItem text={data.brand_name} />}
          {data.brand_description !== '' && (
            <DetailsItem text={data.brand_description} />
          )}
          {data.conditions_description !== '' && (
            <DetailsItem text={data.conditions_description} />
          )}
          {data.usage_instruction !== '' && (
            <DetailsItem text={data.usage_instruction} />
          )}
        </View>
      )}
    </View>
  );
};

export default AvailableRewardsItem;

const DetailsItem = ({text}: any) => {
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

  const htmlContent = `
          <div style="font-family: '${dynamicFontFamily}'; color: ${dynamicColor}; font-size: ${fontSize}px; line-height: ${lineHeight}px">
            ${text}
          </div>
          <style>
            div { height: auto !important; }
            img { max-width: 100%; height: auto !important; }
            video { max-width: 100%; height: auto !important; }
          </style>
        `;

  const source = useMemo(() => ({html: htmlContent}), [htmlContent]);

  return (
    <RenderHTML
      source={source}
      tagsStyles={tagsStyles}
      contentWidth={width - 70}
      enableExperimentalBRCollapsing={false}
    />
  );
};
