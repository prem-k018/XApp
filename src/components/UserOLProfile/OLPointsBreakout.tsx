import {Animated, Easing, FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';
import {Transaction} from '@app/model/openLoyalty/OLMemberTransaction';
import Svg, {Circle} from 'react-native-svg';
import {Tier} from '@app/model/openLoyalty/OLTierList';

export type Props = {
  data: Transaction[];
  profileData: any;
  tierData: Tier[];
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const OLPointsBreakout: React.FC<Props> = ({data, profileData, tierData}) => {
  const {appConfigData} = useAppContext();
  const filteredData = data.filter(
    (item: Transaction) => item.event !== 'Added by admin',
  );

  const currentMonth = new Date().toLocaleString('default', {month: 'short'});

  const sortedData = [...filteredData].sort(
    (a, b) => b.pointsEarned - a.pointsEarned,
  );
  const mainData = sortedData.slice(0, 4);
  const remainingData = sortedData.slice(4);
  const remainingPointsEarned = remainingData.reduce(
    (sum, item) => sum + item?.pointsEarned,
    0,
  );

  const displayData =
    sortedData.length > 5
      ? [
          ...sortedData.slice(0, 4),
          {
            event: 'Others',
            pointsEarned: sortedData
              .slice(5)
              .reduce((acc, item) => acc + item.pointsEarned, 0),
          },
        ]
      : sortedData;

  const totalEarnedPoints = profileData?.userPointsInfo?.totalEarnedPoints;
  const thisMonthEarnedPoints = profileData?.userPointsInfo?.thisMonth;
  const minDiameter = 5 * 48;
  const diameter = Math.max(displayData.length * 48, minDiameter);
  const thickness = theme.cardPadding.smallXsize;
  const radius = (diameter - thickness) / 2;
  const center = diameter / 2;

  const colors = [
    appConfigData?.primary_color,
    '#2874F0',
    '#3C91FF',
    '#6EB8F9',
    '#B4DBFC',
    '#00C8F6',
  ];

  const animateValue = useRef(
    displayData.map(() => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    displayData.forEach((item, index) => {
      const progressPercent =
        (item?.pointsEarned / thisMonthEarnedPoints) * 100;

      Animated.timing(animateValue[index], {
        toValue: progressPercent,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    });
  }, [mainData, remainingPointsEarned, thisMonthEarnedPoints]);

  const renderCircles = () => {
    return displayData.map((item, index) => {
      const currentRadius = radius - index * (thickness + 10);
      const circumference = 2 * Math.PI * currentRadius;
      const color = colors[index % colors.length];

      return (
        <React.Fragment key={index}>
          <Circle
            stroke="#e8e8e8"
            fill="none"
            cx={center}
            cy={center}
            r={currentRadius}
            strokeWidth={thickness}
          />
          <AnimatedCircle
            stroke={color}
            fill="none"
            cx={center}
            cy={center}
            r={currentRadius}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={animateValue[index].interpolate({
              inputRange: [0, 100],
              outputRange: [circumference, 0],
            })}
            strokeLinecap="round"
            strokeWidth={thickness}
            transform={`rotate(-90, ${center}, ${center})`}
          />
        </React.Fragment>
      );
    });
  };

  const EventDetails = ({item, index}: any) => {
    const backgroundColor = colors[index % colors.length];
    return (
      <View style={styles.eventContainer}>
        <View
          style={[styles.colorCode, {backgroundColor: backgroundColor}]}></View>
        <Text style={styles.eventPointText} numberOfLines={1}>
          <Text style={styles.eventPointText}>{item?.pointsEarned} </Text>
          <Text style={styles.ptsText}>PTS</Text>
        </Text>
        <View style={styles.eventTextContainer}>
          <Text style={styles.eventText} numberOfLines={1}>
            {item?.event}
          </Text>
        </View>
      </View>
    );
  };

  let currentTier = null;
  let nextTier = null;

  for (let i = 0; i < tierData.length; i++) {
    const tier = tierData[i];
    const requiredPoints = tier.condition[0].value;

    if (totalEarnedPoints >= requiredPoints) {
      currentTier = tier;
    } else {
      nextTier = tier;
      break;
    }
  }

  let pointsNeeded = nextTier
    ? nextTier.condition[0].value - totalEarnedPoints
    : 0;

  const styles = StyleSheet.create({
    container: {
      marginVertical: theme.cardPadding.mediumSize,
      gap: theme.cardPadding.carMargin,
    },
    headingText: {
      marginHorizontal: theme.cardMargin.left,
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.secondary_text_color,
      alignSelf: 'flex-start',
    },
    centerContainer: {
      height: 40,
      width: 40,
      borderRadius: theme.cardPadding.mediumSize,
      backgroundColor: '#8CC8FA',
      position: 'absolute',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      bottom: diameter / 2 - 20,
    },
    text: {
      position: 'absolute',
      alignSelf: 'center',
      textAlign: 'center',
      fontSize: theme.fontSize.font24,
      fontFamily: theme.fonts.HCLTechRoobert.bold,
      color: '#007AFF',
    },
    eventView: {
      gap: theme.cardPadding.smallXsize + 2,
      paddingHorizontal: theme.cardMargin.left,
    },
    eventContainer: {
      borderRadius: theme.border.borderRadius,
      backgroundColor: '#F7F7FC',
      paddingHorizontal: theme.cardPadding.smallXsize,
      paddingVertical: 12,
      gap: 10,
      width: 130,
      justifyContent: 'center',
      alignItems: 'center',
    },
    eventPointText: {
      fontFamily: theme.fonts.DMSans.bold,
      fontSize: theme.fontSize.font24,
      color: theme.colors.blue,
    },
    ptsText: {
      fontFamily: theme.fonts.DMSans.light,
      fontSize: theme.fontSize.font12,
      color: theme.colors.grayScale7,
      textAlign: 'center',
    },
    eventTextContainer: {
      flexDirection: 'row',
      gap: 6,
    },
    colorCode: {
      height: 12,
      width: 12,
      alignSelf: 'center',
    },
    eventText: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
      textAlign: 'center',
      flex: 1,
    },
    tierPointText: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.lightGray,
      marginBottom: 5,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>Activity Summary: {currentMonth}</Text>
      {data.length > 0 ? (
        <View>
          <Svg width={diameter} height={diameter} style={{alignSelf: 'center'}}>
            {renderCircles()}
          </Svg>
          <View style={styles.centerContainer}>
            <Text style={styles.text}>
              {profileData?.userProfileInfo?.firstName?.charAt(0)}
            </Text>
          </View>
        </View>
      ) : (
        <Text style={[styles.eventText, {textAlign: 'center', marginTop: 30}]}>
          No data available
        </Text>
      )}
      <FlatList
        data={displayData}
        contentContainerStyle={styles.eventView}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        renderItem={({item, index}) => (
          <EventDetails item={item} index={index} />
        )}
        nestedScrollEnabled
      />
      <View>
        {nextTier ? (
          <Text style={styles.tierPointText}>
            Earn {pointsNeeded} points more to reach {nextTier.tierName}
          </Text>
        ) : (
          <Text style={styles.tierPointText}>
            You have reached the highest tier {currentTier?.tierName}
          </Text>
        )}
        <Text
          style={[
            styles.eventText,
            {color: appConfigData?.primary_color, textAlign: 'center'},
          ]}>
          My points Explained
        </Text>
      </View>
    </View>
  );
};

export default OLPointsBreakout;
