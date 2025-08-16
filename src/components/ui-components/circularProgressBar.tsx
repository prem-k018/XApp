import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Svg, Circle} from 'react-native-svg';
import {theme} from '@app/constants';
import {useAppContext} from '@app/store/appContext';

type CircularProgressBarProps = {
  diameter: number;
  thickness: number;
  progressPercent: number;
  color: string;
  centerText: string;
};

const CircularProgressBar = (props: CircularProgressBarProps) => {
  const {diameter, thickness, progressPercent, color, centerText} = props;
  const radius = (diameter - thickness) / 2;
  const circumference = radius * 2 * Math.PI;
  const {appConfigData} = useAppContext();

  const styles = StyleSheet.create({
    circularView: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scoreText: {
      color: appConfigData?.primary_text_color,
      fontFamily: theme.fonts.HCLTechRoobert.bold,
    },
  });

  return (
    <View>
      <Svg width={diameter} height={diameter}>
        <Circle
          stroke={theme.colors.lightGray}
          fill="none"
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          strokeWidth={thickness}
        />
        <Circle
          stroke={color}
          fill="none"
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={
            radius * Math.PI * 2 * ((100 - progressPercent) / 100)
          }
          strokeLinecap="round"
          transform={`rotate(-90, ${diameter / 2}, ${diameter / 2})`}
          strokeWidth={thickness}
        />
      </Svg>
      <View style={styles.circularView}>
        <Text
          style={[
            {
              fontSize: diameter / 4,
            },
            styles.scoreText,
          ]}>
          {centerText}
        </Text>
      </View>
    </View>
  );
};

export default CircularProgressBar;
