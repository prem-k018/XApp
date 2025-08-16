import {theme} from '@app/constants';
import {useAppContext} from '@app/store/appContext';
import React, {useEffect, useRef} from 'react';
import {Animated, View, StyleSheet} from 'react-native';

type ProgressBarProps = {
  progress: number;
  progressTotal: number;
  maxWidth: number;
};

const ProgressBar = (props: ProgressBarProps) => {
  const animatedValue = useRef(new Animated.Value(-1000)).current;
  const animatedToValue = useRef(new Animated.Value(-1000)).current;
  const {appConfigData} = useAppContext();

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: animatedToValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const newValue = (props.progress / props.progressTotal) * props.maxWidth;
    animatedToValue.setValue(newValue - props.maxWidth);
  }, [props, animatedToValue]);

  const styles = StyleSheet.create({
    container: {
      height: 5,
      overflow: 'hidden',
      backgroundColor: theme.colors.grayScale5,
    },
    fill: {
      height: 5,
      width: '100%',
      backgroundColor: appConfigData?.primary_color,
    },
  });

  return (
    <View
      style={[
        {
          width: props.maxWidth,
        },
        styles.container,
      ]}>
      <Animated.View
        style={[
          {
            transform: [{translateX: animatedValue}],
          },
          styles.fill,
        ]}
      />
    </View>
  );
};

export default ProgressBar;
