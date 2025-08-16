/* eslint-disable react/self-closing-comp */
import {images} from '@app/assets/images';
import {theme} from '@app/constants';
import React, {useEffect} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';

interface PopupProps {
  points: number;
  onClose: () => void;
}

const PointPopup: React.FC<PopupProps> = ({points, onClose}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Close popup after 2 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [onClose]);

  return (
    <View style={styles.container}>
      <View style={styles.overlay}></View>
      <View style={styles.popup}>
        <Image source={images.pointEarnImage} style={styles.image} />
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.message}>You earned {points} coins </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 50% black transparency
  },
  popup: {
    backgroundColor: '#fff',
    alignItems: 'center',
    maxWidth: '80%',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 0,
  },
  message: {
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 40,
    fontFamily: theme.fonts.HCLTechRoobert.regular,
    fontSize: theme.fontSize.font16,
  },
  title: {
    textAlign: 'center',
    marginHorizontal: 10,
    fontFamily: theme.fonts.HCLTechRoobert.regular,
    fontSize: theme.fontSize.font24,
  },
});

export default PointPopup;
