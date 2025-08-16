/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';
import {icons} from '@app/assets/icons';
import {theme} from '@app/constants';
import SafeAreaUtils from '@app/utils/safeAreaUtils';

const BackButton = ({onPress}: any) => {
  const safeAreaInsets = SafeAreaUtils.getSafeAreaInsets();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {marginTop: safeAreaInsets.top > 0 ? safeAreaInsets.top : 20},
      ]}
      onPress={onPress}>
      <Image source={icons.backwardArrow} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    display: 'flex',
    height: 30,
    width: 30,
    backgroundColor: theme.colors.headerButtonBGColor,
    borderRadius: theme.border.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    left: theme.cardMargin.left,
  },
});

export default BackButton;
