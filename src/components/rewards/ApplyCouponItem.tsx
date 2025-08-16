import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useAppContext} from '@app/store/appContext';
import {IssuedReward} from '@app/model/rewards/issuedRewardList';
import {theme} from '@app/constants';

export type Props = {
  data: IssuedReward;
  index: number;
  handleCouponDetails: (couponCode: string, issuedRewardId: string) => void;
};

const ApplyCouponItem: React.FC<Props> = ({
  data,
  index,
  handleCouponDetails,
}) => {
  const {appConfigData} = useAppContext();

  const handleApplyCoupon = () => {
    handleCouponDetails(
      data?.issued_coupon?.coupon_code,
      data?.issued_reward_id,
    );
  };

  const styles = StyleSheet.create({
    container: {
      borderWidth: theme.border.borderWidth,
      borderColor: theme.colors.grayScale4,
      paddingVertical: theme.cardPadding.defaultPadding,
      paddingHorizontal: theme.cardPadding.mediumSize,
      borderRadius: theme.border.borderRadius,
      gap: 8,
    },
    couponView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    couponCode: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.primary_color,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderWidth: theme.border.borderWidth,
      borderColor: appConfigData?.primary_color,
      borderStyle: 'dashed',
      borderRadius: theme.border.borderRadius,
    },
    applyText: {
      fontFamily: theme.fonts.Inter.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.primary_color,
      alignSelf: 'center',
    },
    divider: {
      borderBottomWidth: 1.5,
      borderBottomColor: theme.colors.grayScale4,
      marginVertical: 5,
    },
    text: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.couponView}>
        <Text style={styles.couponCode}>
          {data?.issued_coupon?.coupon_code}
        </Text>
        <Text style={styles.applyText} onPress={handleApplyCoupon}>
          Apply
        </Text>
      </View>
      <View style={styles.divider} />
      <Text style={styles.text}>{data?.reward_name}</Text>
      <Text style={styles.text}>
        Expiry :{' '}
        <Text style={{fontFamily: theme.fonts.DMSans.semiBold}}>
          {data?.issued_coupon?.active_to?.split('T')[0]}
        </Text>
      </Text>
    </View>
  );
};

export default ApplyCouponItem;
