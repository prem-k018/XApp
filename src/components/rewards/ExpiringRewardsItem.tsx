import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';
import screensUtils from '@app/utils/screensUtils';
import {icons} from '@app/assets/icons';
import {Point} from '@app/model/rewards/expiredReward';
import {getDatePosted} from '@app/utils/HelperFunction';

export type Props = {
  data: Point;
  index: number;
};

const ExpiringRewardsItem: React.FC<Props> = ({data, index}) => {
  const {appConfigData} = useAppContext();
  const [expired, setExpired] = useState<boolean>(false);

  const screenWidth = screensUtils.screenWidth;
  const containerWidth =
    screenWidth - (theme.cardMargin.left + theme.cardMargin.right);

  const activeTo = data?.expires_at;
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

  const styles = StyleSheet.create({
    container: {
      paddingVertical: theme.cardPadding.mediumSize,
      paddingHorizontal: theme.cardPadding.defaultPadding,
      borderWidth: theme.border.borderWidth,
      borderRadius: theme.border.borderRadius,
      borderColor: theme.colors.grayScale4,
      width: containerWidth,
      gap: 2,
    },
    pointsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 8,
      paddingVertical: 2,
      gap: 4,
      borderRadius: theme.cardPadding.mediumSize,
      backgroundColor: expired ? '#FFEBEE' : theme.colors.grayScale4,
      alignItems: 'center',
      alignSelf: 'flex-start',
    },
    pointText: {
      fontFamily: theme.fonts.Inter.regular,
      fontSize: theme.fontSize.font12,
      color: expired ? theme.colors.Grayscale : theme.colors.primaryBlack,
    },
    expiryDate: {
      fontFamily: theme.fonts.HCLTechRoobert.bold,
      fontSize: theme.fontSize.font14,
      color: expired
        ? theme.colors.Grayscale
        : appConfigData?.secondary_text_color,
    },
    rewardName: {
      fontFamily: theme.fonts.Inter.semiBold,
      fontSize: theme.fontSize.font14,
      color: expired
        ? theme.colors.Grayscale
        : appConfigData?.secondary_text_color,
      marginTop: 8,
    },
    orderContainer: {
      flexDirection: 'row',
      paddingRight: 70,
      flex: 1,
    },
    pointId: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      fontSize: theme.fontSize.font14,
      color: expired
        ? theme.colors.Grayscale
        : appConfigData?.secondary_text_color,
    },
    expiringSoon: {
      fontFamily: theme.fonts.Inter.semiBold,
      fontSize: theme.fontSize.font12,
      color: expired ? theme.colors.red : appConfigData?.primary_color,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.pointsContainer}>
        <Image source={icons.loyaltyPointIcon} />
        <Text style={styles.pointText}>{data.points} pts</Text>
      </View>
      <Text style={styles.rewardName}>{data.point_desc}</Text>
      <View style={styles.orderContainer}>
        <Text style={styles.pointId}>Order ID : </Text>
        <Text style={styles.pointId} numberOfLines={2}>
          {data.point_id}
        </Text>
      </View>
      <Text style={styles.pointId}>
        Credit Date : {getDatePosted(data.created_at)}
      </Text>
      {data.expires_at && (
        <Text style={styles.expiryDate}>
          Expire Date : {getDatePosted(data.expires_at)}
          {'  '}
          <Text style={styles.expiringSoon}>
            {expired ? 'Expired' : 'Expiring Soon'}
          </Text>
        </Text>
      )}
    </View>
  );
};

export default ExpiringRewardsItem;
