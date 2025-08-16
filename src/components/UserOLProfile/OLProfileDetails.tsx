import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
} from 'react-native';
import React from 'react';
import {useAppContext} from '@app/store/appContext';
import {images} from '@app/assets/images';
import {theme} from '@app/constants';
import LinearGradient from 'react-native-linear-gradient';
import LoyaltyTierRank from '../UserProfile/LoyaltyTierRank';
import {Tier} from '@app/model/openLoyalty/OLTierList';
import {UserProfile} from '@app/model/profile/userProfile';
import {formatPoints} from '@app/utils/HelperFunction';

export type Props = {
  data: any;
  tierData: Tier[];
  profileData: UserProfile | any;
};

const OLProfileDetails: React.FC<Props> = ({data, tierData, profileData}) => {
  const {appConfigData} = useAppContext();

  const TotalEarnedPoints = data?.userPointsInfo?.totalEarnedPoints;

  const UserPointInfo = ({text, value}: any) => (
    <View>
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.textScore}>{formatPoints(value)}</Text>
    </View>
  );

  const styles = StyleSheet.create({
    profileAvatar: {
      height: 291,
      width: 194,
      alignSelf: 'center',
    },
    divider: {
      borderBottomWidth: theme.border.borderWidth,
      borderBottomColor: '#293B9A',
    },
    greet: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font20,
      color: appConfigData?.primary_text_color,
      textAlign: 'center',
      marginTop: 5,
    },
    name: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font36,
      color: appConfigData?.primary_text_color,
      textAlign: 'center',
    },
    achievementContainer: {
      borderRadius: theme.border.borderRadius,
      paddingVertical: theme.cardPadding.defaultPadding,
      paddingHorizontal: theme.cardMargin.left,
      gap: theme.cardPadding.defaultPadding,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    text: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.primary_text_color,
    },
    textScore: {
      fontFamily: theme.fonts.DMSans.bold,
      fontSize: theme.fontSize.font24,
      color: appConfigData?.primary_text_color,
    },
    itemDivider: {
      backgroundColor: appConfigData?.primary_text_color,
      width: 1.5,
    },
    dailyProgressContainer: {
      marginHorizontal: theme.cardMargin.left,
      marginTop: 22,
      marginBottom: 37,
      gap: theme.cardPadding.mediumSize,
    },
    progressTextContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    progressText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.secondary_text_color,
    },
    progressBarContainer: {
      height: 9.5,
      backgroundColor: '#EFF0F6',
      borderRadius: theme.border.borderRadius,
      overflow: 'hidden',
      marginTop: 4,
      width: '100%',
      position: 'relative',
    },
    progressBar: {
      height: '100%',
      borderRadius: theme.border.borderRadius,
      backgroundColor: appConfigData?.primary_color,
    },
  });

  return (
    <View>
      <LinearGradient
        colors={['#572AC2', '#7747D5', '#4080F5', '#7ABEF7']}
        style={{paddingBottom: theme.cardPadding.defaultPadding}}>
        <ImageBackground source={images.loyaltyBackground}>
          {profileData?.gender?.toLowerCase() === 'female' ? (
            <Image
              source={images.femaleProfileAvatar}
              style={styles.profileAvatar}
            />
          ) : (
            <Image source={images.profileAvatar} style={styles.profileAvatar} />
          )}
        </ImageBackground>
        <View style={styles.divider} />
        <Text style={styles.greet}>Hi,</Text>
        <Text style={styles.name} numberOfLines={2}>
          {data?.userProfileInfo?.firstName} {data?.userProfileInfo?.lastName}
        </Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.achievementContainer}>
          <UserPointInfo
            text={'Total Pts'}
            value={data?.userPointsInfo?.totalEarnedPoints ?? 0}
          />
          <View style={styles.itemDivider}></View>
          <UserPointInfo
            text={'This Month'}
            value={data?.userPointsInfo?.thisMonth ?? 0}
          />
          <View style={styles.itemDivider}></View>
          <UserPointInfo
            text={'Last Month'}
            value={data?.userPointsInfo?.lastMonth ?? 0}
          />
          <View style={styles.itemDivider}></View>
          <UserPointInfo
            text={'Active Pts'}
            value={data?.userPointsInfo?.activePoints ?? 0}
          />
          <View style={styles.itemDivider}></View>
          <UserPointInfo
            text={'Spent Pts'}
            value={data?.userPointsInfo?.spentPoints ?? 0}
          />
        </ScrollView>
        <LoyaltyTierRank
          data={tierData}
          totalPoints={data?.userPointsInfo?.totalEarnedPoints}
          inLoyaltyScreen={true}
        />
      </LinearGradient>
      <View style={styles.dailyProgressContainer}>
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>Monthly Progress</Text>
          <Text style={styles.progressText}>
            {formatPoints(data?.dailyProgress ?? 0)} PTS
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${
                  (data?.userPointsInfo?.thisMonth / TotalEarnedPoints) * 100
                }%`,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

export default OLProfileDetails;
