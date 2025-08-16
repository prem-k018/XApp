/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Text, Animated, StyleSheet, Platform} from 'react-native';

interface AnimatedNotificationProps {
  message: string;
}

const AnimatedNotification: React.FC<AnimatedNotificationProps> = ({
  message,
}) => {
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    const fadeOut = () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500, // You can adjust the duration of the animation
        useNativeDriver: true,
      }).start();
    };

    const timer = setTimeout(() => {
      fadeOut();
    }, 5000); // Auto remove after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: 16,
    },
    message: {
      color: 'white',
    },
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          paddingTop: Platform.OS === 'ios' ? 64 : 0, // Adjust padding top for iOS to avoid the notch
        },
      ]}>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

export default AnimatedNotification;
