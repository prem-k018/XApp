import {useAppContext} from '@app/store/appContext';
import React from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';

const LoaderOverlay = () => {
  const {appConfigData} = useAppContext();

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={appConfigData?.primary_color} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoaderOverlay;
