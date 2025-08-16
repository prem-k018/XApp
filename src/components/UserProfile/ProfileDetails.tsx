import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useAppContext} from '@app/store/appContext';
import {images} from '@app/assets/images';
import {theme} from '@app/constants';
import {calculateAge, capitalizeFirstLetter} from '@app/utils/HelperFunction';
import {icons} from '@app/assets/icons';
import {loadImageByAddingBaseUrl} from '@app/utils/imageLinkUtils';
import {UserProfile} from '@app/model/profile/userProfile';

export type Props = {
  data: UserProfile | any;
  currentTierName: string;
};

const ProfileDetails: React.FC<Props> = ({data, currentTierName}) => {
  const {appConfigData} = useAppContext();
  const [validUrl, setValidUrl] = useState<boolean>(false);

  const profileImage = loadImageByAddingBaseUrl(data.image);
  if (data.image !== '') {
    const isValidImageUrl = async (profileImage: string) => {
      return Image.prefetch(profileImage)
        .then(() => {
          setValidUrl(true);
        })
        .catch(() => setValidUrl(false));
    };
    isValidImageUrl(profileImage);
  }

  const InfoDetails = ({title, info}: any) => {
    return (
      <View style={styles.detailContainer}>
        <Text style={[styles.detailText, {width: 120}]}>{title}</Text>
        <Text style={styles.detailText}>:</Text>
        <Text style={styles.infoText} numberOfLines={2}>
          {info}
        </Text>
      </View>
    );
  };

  const TierIcon = () => {
    switch (currentTierName) {
      case 'Bronze':
        return <Image source={icons.bronzeBadge} style={styles.badges} />;
      case 'Silver':
        return <Image source={icons.silverBadge} style={styles.badges} />;
      case 'Gold':
        return <Image source={icons.goldBadge} style={styles.badges} />;
      case 'Platinum':
        return <Image source={icons.platinumBadge} style={styles.badges} />;
      default:
        <Image source={icons.bronzeBadge} style={styles.badges} />;
    }
  };

  const styles = StyleSheet.create({
    container: {
      paddingVertical: 24,
      backgroundColor: '#FAFAFA',
    },
    subContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 22,
    },
    profileAvatar: {
      height: 98,
      width: 98,
      borderRadius: 49,
      borderWidth: theme.border.borderWidth,
      borderColor: '#D9D9D9',
      marginBottom: 22,
    },
    badges: {
      position: 'absolute',
      height: 28,
      width: 28,
      bottom: 6,
      alignSelf: 'center',
    },
    fullName: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font20,
      color: appConfigData?.secondary_text_color,
    },
    dob: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.lightGray,
    },
    detailContainer: {
      flexDirection: 'row',
      gap: theme.cardPadding.mediumSize,
      marginBottom: theme.cardMargin.bottom,
      marginHorizontal: theme.cardMargin.left,
    },
    detailText: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.grayScale7,
    },
    infoText: {
      flex: 1,
      fontFamily: theme.fonts.DMSans.semiBold,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <View>
          <Image
            source={
              validUrl
                ? {uri: profileImage}
                : data?.gender?.toLowerCase() === 'male'
                ? images.profileAvatar
                : images.femaleProfileAvatar
            }
            style={styles.profileAvatar}
            resizeMode="contain"
          />
          <TierIcon />
        </View>
        <Text style={styles.fullName}>
          {data?.first_name} {data?.last_name}
        </Text>
        {data?.dob ? (
          <Text style={styles.dob}>
            {calculateAge(data?.dob)}, {capitalizeFirstLetter(data?.gender)}
          </Text>
        ) : (
          <Text style={styles.dob}>{capitalizeFirstLetter(data?.gender)}</Text>
        )}
      </View>
      <View>
        <InfoDetails title={'First Name'} info={data?.first_name} />
        <InfoDetails title={'Last Name'} info={data?.last_name} />
        {data?.phone && (
          <InfoDetails title={'Phone Number'} info={data?.phone} />
        )}
        {/* <InfoDetails title={'Country'} info={'India'} /> */}
        <InfoDetails
          title={'Loyalty Card no'}
          info={data?.loyalty_card_number}
        />
        {/* <InfoDetails title={'Membership ID'} info={data?.member_id} /> */}
        <InfoDetails title={'Email Address'} info={data?.email} />
      </View>
    </View>
  );
};

export default ProfileDetails;
