/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {StyleSheet, View, Animated} from 'react-native';
import {theme} from '@app/constants';
import {useEffect, useRef} from 'react';
import {useAppContext} from '@app/store/appContext';

type AnimatedStoryBarProps = {
  progress: number; // 0-1 range
  width: number;
};

const AnimatedStoryBar = ({progress, width}: AnimatedStoryBarProps) => {
  const animatedValue = useRef(new Animated.Value(-width)).current;
  const animatedToValue = useRef(new Animated.Value(-width)).current;
  const {appConfigData} = useAppContext();

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: animatedToValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    animatedToValue.setValue(progress * width - width);
  }, [progress]);

  return (
    <View
      style={{
        width: width,
        height: 4,
        backgroundColor: '#FFFFFF66',
        overflow: 'hidden',
        borderRadius: 2,
      }}>
      <Animated.View
        style={{
          width: '100%',
          height: 4,
          backgroundColor: theme.colors.primaryWhite,
          borderRadius: 2,
          transform: [{translateX: animatedValue}],
        }}
      />
    </View>
  );
};

//TODO Move inline styles here
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AnimatedStoryBar;
