import {
  Alert,
  Animated,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef} from 'react';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';
import {icons} from '@app/assets/icons';
import {Campaign} from '@app/model/openLoyalty/OLCampaignList';

export type Props = {
  data: Campaign[];
};

const CampaignChallenges: React.FC<Props> = ({data}) => {
  const {appConfigData} = useAppContext();

  const defaultImage =
    'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg';

  const filteredData = data.filter((item: any) => item?.isActive);

  const ChallengesItem = ({item, index}: any) => {
    const handleOpenURL = async (url: string) => {
      if (!url) {
        Alert.alert('URL is empty', 'Please provide a valid URL to open.');
        return;
      }
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        Alert.alert('Invalid URL', 'Provide the correct Url');
        return;
      }
      await Linking.openURL(url);
    };

    const PointsEarnsDisplay = ({pointsEarns}: any) => {
      const getIconAndText = (points_earn: any, type: any) => {
        if (type === 'points') {
          return {icon: icons.loyaltyPointIcon, text: `${points_earn}pts`};
        } else if (type === 'Offer') {
          return {icon: icons.offerIcon, text: 'Offer'};
        } else if (type === 'Coupon') {
          return {icon: icons.couponIcon, text: 'Coupon'};
        } else {
          return {icon: null, text: ''};
        }
      };

      const {icon, text} = getIconAndText(
        pointsEarns[0].points_earn,
        pointsEarns[0].type,
      );

      return (
        <View style={styles.pointsContainer}>
          <Image source={icon} />
          <Text style={styles.pointText}>{text}</Text>
          {pointsEarns.length > 1 && (
            <Text style={styles.pointText}>
              {'+ '}
              {pointsEarns.length - 1} more
            </Text>
          )}
        </View>
      );
    };

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => handleOpenURL(item?.destinationUrl)}
        key={item?.campaignId}
        style={styles.itemContainer}>
        <Image
          style={styles.image}
          source={
            item?.imageUrl !== '' ? {uri: item?.imageUrl} : {uri: defaultImage}
          }
        />
        <View style={styles.details}>
          <PointsEarnsDisplay pointsEarns={item.pointsEarns} />
          <Text style={styles.title} numberOfLines={2}>
            {item.campaignName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    container: {
      paddingTop: theme.cardPadding.defaultPadding,
      paddingBottom: 37,
      paddingHorizontal: theme.cardMargin.left,
      gap: theme.cardPadding.mediumSize,
    },
    headingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    topic: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.secondary_text_color,
    },
    seeAllText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font12,
      color: appConfigData?.primary_color,
    },
    itemContainer: {
      flexDirection: 'row',
      gap: theme.cardPadding.mediumSize,
    },
    image: {
      height: 68,
      width: 68,
    },
    details: {
      gap: 4,
      flex: 1,
    },
    pointsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 8,
      paddingVertical: 2,
      gap: 4,
      borderRadius: theme.cardPadding.mediumSize,
      backgroundColor: theme.colors.grayScale4,
      alignItems: 'center',
      alignSelf: 'flex-start',
    },
    pointText: {
      fontFamily: theme.fonts.Inter.regular,
      fontSize: theme.fontSize.font12,
      color: theme.colors.primaryBlack,
    },
    title: {
      fontFamily: theme.fonts.Inter.medium,
      fontSize: theme.fontSize.font14,
      color: theme.colors.primaryBlack,
    },
    noDataText: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
      textAlign: 'center',
      marginTop: 10,
    },
    scrollBar: {
      position: 'absolute',
      right: 1,
      width: 7,
      backgroundColor: '#A0A3BD',
      borderRadius: 3,
    },
    scrollBarContainer: {
      position: 'absolute',
      right: 0,
      backgroundColor: '#EFF0F6',
      height: '100%',
      width: 9,
      borderRadius: 5,
    },
  });

  const scrollY = useRef(new Animated.Value(0)).current;
  const ITEM_HEIGHT = 76;
  const VIEWPORT_HEIGHT = 305;
  const SCROLL_BAR_HEIGHT = 62;
  const scrollHeight = filteredData.length * ITEM_HEIGHT;
  const inputRange = [0, Math.max(0, scrollHeight - VIEWPORT_HEIGHT)];
  const outputRange = [0, VIEWPORT_HEIGHT - SCROLL_BAR_HEIGHT];

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.topic}>Active Challenges</Text>
      </View>
      <SafeAreaView>
        <View style={{maxHeight: 305}}>
          {filteredData.length !== 0 ? (
            <ScrollView
              onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {y: scrollY}}}],
                {useNativeDriver: false},
              )}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{flexGrow: 1, gap: 10}}
              nestedScrollEnabled>
              {filteredData.map((item: any, index: number) => (
                <View key={index}>
                  <ChallengesItem item={item} index={index} />
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.noDataText}>No data available</Text>
          )}
          {filteredData.length > 4 && (
            <View style={styles.scrollBarContainer}>
              <Animated.View
                style={[
                  styles.scrollBar,
                  {
                    height: SCROLL_BAR_HEIGHT,
                    transform: [
                      {
                        translateY: scrollY.interpolate({
                          inputRange: inputRange,
                          outputRange: outputRange,
                          extrapolate: 'clamp',
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CampaignChallenges;
