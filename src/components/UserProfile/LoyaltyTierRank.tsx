import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';
import {icons} from '@app/assets/icons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ScreenNames from '@app/constants/screenNames';
import LinearGradient from 'react-native-linear-gradient';
import {Tier} from '@app/model/openLoyalty/OLTierList';
import {formatPoints} from '@app/utils/HelperFunction';

export type Props = {
  data?: Tier[];
  totalPoints?: any;
  inLoyaltyScreen?: boolean;
  onTierNameChange?: (tierName: string) => void;
};

const LoyaltyTierRank: React.FC<Props> = ({
  data,
  totalPoints,
  inLoyaltyScreen,
  onTierNameChange,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {appConfigData} = useAppContext();

  const handleNavigation = () => {
    navigation?.navigate(ScreenNames.loyaltyProfileScreen);
  };

  const tiers = data?.filter((item: any) => item?.isActive) || [];
  const sortedTiers = [...tiers]?.sort((a, b) => {
    const aValue = a?.condition[0]?.value || 0;
    const bValue = b?.condition[0]?.value || 0;
    return aValue - bValue;
  });

  const userPoints = totalPoints;

  const maxTierValue =
    sortedTiers[sortedTiers.length - 1]?.condition[0]?.value || 0;
  const progressPercentage = Math.min((userPoints / maxTierValue) * 100, 100);

  const tierNames = sortedTiers?.map(tier => tier?.tierName);

  let currentTierIndex = 0;
  for (let i = 0; i < sortedTiers.length; i++) {
    if (userPoints >= sortedTiers[i].condition[0]?.value) {
      currentTierIndex = i;
    } else {
      break;
    }
  }
  const currentTier = sortedTiers[currentTierIndex];

  useEffect(() => {
    if (onTierNameChange && currentTier?.tierName) {
      onTierNameChange(currentTier.tierName);
    }
  }, [currentTier, onTierNameChange]);

  const tierPositions = sortedTiers.map(tier => {
    const tierValue = tier.condition[0]?.value || 0;
    return Math.min((tierValue / maxTierValue) * 100, 100);
  });

  const TierIcon = () => {
    switch (currentTier?.tierName) {
      case 'Bronze':
        return <Image source={icons.bronzeBadge} style={styles.icon} />;
      case 'Silver':
        return <Image source={icons.silverBadge} style={styles.icon} />;
      case 'Gold':
        return <Image source={icons.goldBadge} style={styles.icon} />;
      case 'Platinum':
        return <Image source={icons.platinumBadge} style={styles.icon} />;
      default:
        <Image source={icons.bronzeBadge} style={styles.icon} />;
    }
  };

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: theme.cardMargin.left,
      paddingVertical: theme.cardPadding.mediumSize,
    },
    cardContainer: {
      backgroundColor: inLoyaltyScreen
        ? '#BFBCFF75'
        : appConfigData?.background_color,
      borderRadius: theme.border.borderRadius,
      borderWidth: theme.border.borderWidth,
      borderColor: inLoyaltyScreen ? theme.colors.grayScale4 : '#C4C5C4',
      padding: theme.cardPadding.defaultPadding,
      paddingBottom: theme.cardPadding.carMargin,
      shadowColor: appConfigData?.secondary_text_color,
      flexDirection: 'row',
      gap: theme.cardMargin.xSmall,
    },
    icon: {
      width: 44,
      height: 44,
      alignSelf: 'center',
      marginTop: 10,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    tier: {
      fontFamily: theme.fonts.DMSans.semiBold,
      fontSize: theme.fontSize.font16,
      color: inLoyaltyScreen
        ? appConfigData?.primary_text_color
        : appConfigData?.secondary_text_color,
    },
    tierPoint: {
      fontFamily: theme.fonts.DMSans.semiBold,
      fontSize: theme.fontSize.font14,
      color: inLoyaltyScreen
        ? appConfigData?.primary_text_color
        : theme.colors.lightGray,
    },
    progressBarContainer: {
      height: 9.5,
      backgroundColor: '#EFF0F6',
      borderRadius: theme.border.borderRadius,
      overflow: 'hidden',
      marginTop: 8,
      width: '100%',
      position: 'relative',
    },
    progressBar: {
      height: '100%',
      borderRadius: theme.border.borderRadius,
    },
    tierLabelsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.cardPadding.defaultPadding,
    },
    tierLabel: {
      position: 'absolute',
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font12,
      color: inLoyaltyScreen
        ? appConfigData?.primary_text_color
        : theme.colors.lightGray,
    },
    verticalLine: {
      position: 'absolute',
      height: 20,
      top: 3,
      width: 1.5,
      backgroundColor: theme.colors.grayScale4,
    },
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handleNavigation}
      style={styles.container}>
      <View style={styles.cardContainer}>
        <TierIcon />
        <View style={{flex: 1}}>
          <View style={styles.headerContainer}>
            <Text style={styles.tier}>{currentTier?.tierName}</Text>
            <Text style={styles.tierPoint}>{formatPoints(userPoints)} PTS</Text>
          </View>
          <View>
            <View style={styles.progressBarContainer}>
              <LinearGradient
                colors={['#409344', '#80C683']}
                style={[styles.progressBar, {width: `${progressPercentage}%`}]}
              />
            </View>
            {tierPositions.map((position, index) => (
              <View
                key={index}
                style={[styles.verticalLine, {left: `${position}%`}]}
              />
            ))}
            <View style={styles.tierLabelsContainer}>
              {tierPositions.map((position, index) =>
                index < tierPositions.length - 1 ? (
                  <Text
                    key={index}
                    style={[styles.tierLabel, {left: `${position - 5}%`}]}>
                    {tierNames[index]}
                  </Text>
                ) : (
                  <Text key={index} style={[styles.tierLabel, {right: -10}]}>
                    {tierNames[index]}
                  </Text>
                ),
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LoyaltyTierRank;
