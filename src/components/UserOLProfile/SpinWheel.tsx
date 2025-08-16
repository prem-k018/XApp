import {icons} from '@app/assets/icons';
import {theme} from '@app/constants';
import {SelectItem} from '@app/model/contentType/schemaContentDetail';
import getSchemaContentDetail from '@app/services/contentType/schemaContentDetail';
import {useAppContext} from '@app/store/appContext';
import screensUtils from '@app/utils/screensUtils';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {G, Line, Path, Text as SvgText} from 'react-native-svg';
import SpinWheelResult from '../Popup/SpinWheelResult';
import getRewardDetails from '@app/services/rewards/rewardDetails';
import {RewardDetails} from '@app/model/rewards/rewardDetails';

export type Props = {
  data?: any;
  visible: boolean;
  onClose: () => void;
};

const SpinWheel: React.FC<Props> = ({data, visible, onClose}) => {
  const {appConfigData} = useAppContext();
  const [selectedValue, setSelectedValue] = useState<SelectItem>();
  const [wheelData, setWheelData] = useState<SelectItem[]>();
  const [rewardData, setRewardData] = useState<RewardDetails>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rewardLoading, setRewardLoading] = useState<boolean>(false);
  const [resultVisible, setResultVisible] = useState<boolean>(false);

  const screenWidth = screensUtils.screenWidth;
  const containerWidth =
    screenWidth - (theme.cardPadding.mediumSize + theme.cardPadding.mediumSize);

  useEffect(() => {
    fetchWheelData();
  }, []);

  useEffect(() => {
    if (wheelData && wheelData.length % 2 !== 0) {
      setWheelData(prevData => [...(prevData as any), {label: 'Try Again!'}]);
    }
  }, [wheelData]);

  const numSegments = wheelData?.length ? wheelData?.length : 1;
  const anglePerSegment = 360 / numSegments;

  const rotation = useRef(new Animated.Value(0)).current;

  const outerCircle = containerWidth - 30;
  const outerCircleRadius = outerCircle / 2;

  const size = outerCircle - 40;
  const radius = size / 2;

  const finalAngleRef = useRef(0);

  const fetchWheelData = async () => {
    try {
      setIsLoading(true);

      const type = 'wheel';
      const contents = await getSchemaContentDetail(data.Id as any, type);

      if ('data' in contents && contents?.data?.publish_fetchSchemaContent) {
        const newData = contents.data.publish_fetchSchemaContent;
        const selectData = JSON.parse(
          (newData?.select || ('[]' as any)) as any,
        );
        setWheelData(selectData);
        setIsLoading(false);
      } else {
        console.log('Something went wrong!');
        setIsLoading(false);
      }
    } catch (error: any) {
      console.log(error.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const createArcPath = (startAngle: number, endAngle: number, r: number) => {
    const startRad = (Math.PI * (startAngle - 90)) / 180;
    const endRad = (Math.PI * (endAngle - 90)) / 180;
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    const x1 = r + r * Math.cos(startRad);
    const y1 = r + r * Math.sin(startRad);
    const x2 = r + r * Math.cos(endRad);
    const y2 = r + r * Math.sin(endRad);

    return `M${r},${r} L${x1},${y1} A${r},${r} 0 ${largeArcFlag},1 ${x2},${y2} Z`;
  };

  const spinWheel = () => {
    setSelectedValue(null as any);
    const randomFullTurns = Math.floor(Math.random() * 5) + 3;
    const randomOffset = Math.floor(Math.random() * 360);
    const toValue = 360 * randomFullTurns + randomOffset;

    const minDuration = 2000;
    const maxDuration = 3000;
    const chosenDuration =
      Math.floor(Math.random() * (maxDuration - minDuration)) + minDuration;

    Animated.timing(rotation, {
      toValue,
      duration: chosenDuration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      finalAngleRef.current = toValue % 360;
      const adjustedAngle = (360 - finalAngleRef.current) % 360;
      const segmentIndex = Math.floor(adjustedAngle / anglePerSegment);
      const result = wheelData?.[segmentIndex];
      setSelectedValue(result as any);
      if (result?.label !== 'Try Again!') {
        getRewardDetailData(result?.id as string);
      }
      setResultVisible(true);
      console.log('Selected Value:', result?.label);
    });
  };

  const getRewardDetailData = async (param: string) => {
    try {
      setRewardLoading(true);
      const contents = await getRewardDetails(param);
      if ('data' in contents && contents?.data?.users_getRewardDetails) {
        const newData = contents?.data?.users_getRewardDetails;
        setRewardData(newData);
        setRewardLoading(false);
      } else {
        console.log('Something went Wrong!');
        setRewardLoading(false);
      }
    } catch (err) {
      console.log(err);
      setRewardLoading(false);
    } finally {
      setRewardLoading(false);
    }
  };

  const colors = [
    '#FFFB90',
    '#FBE978',
    '#F8DC65',
    '#E6C758',
    '#C49F40',
    '#AC832F',
    '#9E7125',
    '#996C22',
    '#9D7125',
    '#A98030',
    '#BD9A42',
    '#D9BE5A',
    '#FBE978',
    '#FFFFAA',
    '#FBE978',
    '#A4631B',
  ];

  const innerRadius = (size + 8) / 2;
  const outerRadius = (outerCircle - 2) / 2;

  const lines = [];
  for (let angle = 0; angle < 360; angle++) {
    const rad = (angle * Math.PI) / 120;
    const startX = outerCircleRadius + innerRadius * Math.cos(rad);
    const startY = outerCircleRadius + innerRadius * Math.sin(rad);
    const endX = outerCircleRadius + outerRadius * Math.cos(rad);
    const endY = outerCircleRadius + outerRadius * Math.sin(rad);

    lines.push(
      <Line
        key={angle}
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={theme.colors.grayScale6}
        strokeWidth={0.5}
      />,
    );
  }

  const calculateMaxLength = (radius: number, angle: number) => {
    const arcLength = (2 * Math.PI * radius * angle) / 360;
    const approximateCharWidth = 5;
    return Math.floor(arcLength / approximateCharWidth);
  };

  const maxLength = calculateMaxLength(radius * 0.6, anglePerSegment);
  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const WheelColors = [
    {backgroundColor: '#3C7CD2', textColor: appConfigData?.primary_text_color},
    {backgroundColor: '#339cd8', textColor: appConfigData?.primary_text_color},
    {backgroundColor: '#7fb35c', textColor: appConfigData?.primary_text_color},
    {backgroundColor: '#dab12d', textColor: appConfigData?.primary_text_color},
    {backgroundColor: '#E8995B', textColor: appConfigData?.primary_text_color},
    {backgroundColor: '#E06972', textColor: appConfigData?.primary_text_color},
    {backgroundColor: '#924F66', textColor: appConfigData?.primary_text_color},
    {backgroundColor: '#3746BD', textColor: appConfigData?.primary_text_color},
  ];

  const styles = StyleSheet.create({
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    popupContainer: {
      width: containerWidth,
      backgroundColor: appConfigData?.primary_text_color,
      borderRadius: theme.border.borderRadius,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: theme.cardPadding.xLargeSize,
      paddingBottom: theme.cardPadding.largeSize,
    },
    cancelIcon: {
      position: 'absolute',
      top: theme.cardPadding.defaultPadding,
      right: theme.cardPadding.defaultPadding,
      tintColor: appConfigData?.secondary_text_color,
    },
    loading: {
      alignSelf: 'center',
      height: outerCircle,
    },
    title: {
      fontFamily: theme.fonts.HCLTechRoobert.medium,
      fontSize: theme.fontSize.font24,
      color: appConfigData?.secondary_text_color,
      textAlign: 'center',
      marginHorizontal: theme.cardMargin.left,
      marginBottom: theme.cardMargin.xSmall,
    },
    subtitle: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
      marginBottom: theme.cardPadding.mediumSize,
      textAlign: 'center',
      marginHorizontal: theme.cardMargin.left,
    },
    parentWrapper: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
    },
    wheelOuterContainer: {
      position: 'absolute',
      width: outerCircle + 3,
      height: outerCircle + 3,
      borderRadius: (size + 40) / 2,
      borderWidth: 3,
      borderColor: 'rgba(0, 0, 0, 0.3)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    wheelContainer: {
      width: outerCircle,
      height: outerCircle,
      borderRadius: outerCircleRadius,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2,
    },
    wheelInnerContainer: {
      width: size + 6,
      height: size + 6,
      borderWidth: 5,
      borderRadius: (size + 5) / 2,
      borderColor: 'rgba(0, 0, 0, 0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    wheel: {
      width: size,
      height: size,
      alignItems: 'center',
      justifyContent: 'center',
    },
    centerContainer: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: appConfigData?.background_color,
      position: 'absolute',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: theme.colors.grayScale2,
      borderWidth: theme.border.borderWidth,
    },
    center: {
      width: 45,
      height: 45,
      borderRadius: 45 / 2,
      backgroundColor: appConfigData?.primary_color,
      position: 'absolute',
      alignSelf: 'center',
    },
    pointerContainer: {
      position: 'absolute',
      top: 2,
      alignItems: 'center',
      zIndex: 4,
    },
    button: {
      width: 165,
      marginTop: theme.cardPadding.carMargin,
      backgroundColor:
        !isLoading && wheelData?.length !== 0
          ? appConfigData?.primary_color
          : '#C4C5C4',
      paddingVertical: 12,
      borderRadius: theme.border.borderRadius,
    },
    spinText: {
      fontFamily: theme.fonts.DMSans.semiBold,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.primary_text_color,
      textAlign: 'center',
    },
    linesContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: outerCircle,
      height: outerCircle,
      zIndex: 2,
    },
    noDataText: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
      paddingVertical: outerCircle / 2 - 10,
    },
    rewardLoad: {
      flex: 1,
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      alignSelf: 'center',
    },
  });

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}>
      {rewardLoading ? (
        <ActivityIndicator
          color={appConfigData?.primary_color}
          size={'large'}
          style={styles.rewardLoad}
        />
      ) : (
        <View style={styles.modalBackground}>
          <View style={styles.popupContainer}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={onClose}
              style={styles.cancelIcon}>
              <Image
                source={icons.cross}
                tintColor={appConfigData?.secondary_text_color}
              />
            </TouchableOpacity>
            <Text style={styles.title} numberOfLines={2}>
              {data?.Title}
            </Text>
            <Text style={styles.subtitle} numberOfLines={3}>
              {data?.Description}
            </Text>
            {isLoading ? (
              <ActivityIndicator
                color={appConfigData?.primary_color}
                size={'large'}
                style={styles.loading}
              />
            ) : wheelData?.length !== 0 ? (
              <View style={styles.parentWrapper}>
                {/* Outer border container */}
                <View style={styles.wheelOuterContainer} />

                <View style={styles.pointerContainer}>
                  <Image source={icons.pointerIcon} />
                </View>
                {/* Animated wheel (bottom layer) */}
                <LinearGradient colors={colors} style={styles.wheelContainer}>
                  <View style={styles.wheelInnerContainer}>
                    <View style={styles.wheel}>
                      <Animated.View
                        style={{
                          transform: [
                            {
                              rotate: rotation.interpolate({
                                inputRange: [0, 360],
                                outputRange: ['0deg', '360deg'],
                              }),
                            },
                          ],
                        }}>
                        <Svg width={size} height={size}>
                          <G>
                            {wheelData?.map((seg, i) => {
                              const startAngle = i * anglePerSegment;
                              const endAngle = (i + 1) * anglePerSegment;
                              const path = createArcPath(
                                startAngle,
                                endAngle,
                                radius,
                              );

                              const midAngle = startAngle + anglePerSegment / 2;
                              const textRad = (Math.PI * (midAngle - 90)) / 180;
                              const textRadius = radius * 0.5;
                              const textX =
                                radius + textRadius * Math.cos(textRad);
                              const textY =
                                radius + textRadius * Math.sin(textRad);

                              const colorIndex = i % WheelColors.length;
                              const backgroundColor =
                                WheelColors[colorIndex].backgroundColor;
                              const textColor =
                                WheelColors[colorIndex].textColor;

                              return (
                                <G key={i}>
                                  <Path d={path} fill={backgroundColor} />
                                  <SvgText
                                    x={textX}
                                    y={textY}
                                    fill={textColor}
                                    fontSize={theme.fontSize.font12}
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                    transform={`rotate(${
                                      midAngle - 90
                                    }, ${textX}, ${textY})`}>
                                    {truncateText(seg?.label, maxLength)}
                                  </SvgText>
                                </G>
                              );
                            })}
                          </G>
                        </Svg>
                      </Animated.View>

                      {/* <View style={styles.centerContainer}>
                <View style={styles.center} />
              </View> */}
                    </View>
                  </View>
                  <Svg style={styles.linesContainer}>{lines}</Svg>
                </LinearGradient>
              </View>
            ) : (
              <Text style={styles.noDataText}>No data Available</Text>
            )}

            <TouchableOpacity
              style={styles.button}
              disabled={isLoading && wheelData?.length === 0}
              onPress={spinWheel}
              activeOpacity={1}>
              <Text style={styles.spinText}>Spin</Text>
            </TouchableOpacity>

            {selectedValue && (
              <SpinWheelResult
                data={rewardData as RewardDetails}
                visible={resultVisible}
                onClose={() => setResultVisible(false)}
                selectedValue={selectedValue}
                onSpinWheelClose={onClose}
              />
            )}
          </View>
        </View>
      )}
    </Modal>
  );
};

export default SpinWheel;
