import {StyleSheet, View, Image} from 'react-native';
import React from 'react';
import {images} from '@app/assets/images';

export type Props = {
  reward?: boolean;
};

const NoDataScreen: React.FC<Props> = ({reward}) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F3FAFF',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  return (
    <View style={[styles.container, reward && {marginTop: '-25%'}]}>
      <Image
        source={images.noDataFound}
        style={{width: '100%', height: '100%'}}
        resizeMode="contain"
      />
    </View>
  );
};

export default NoDataScreen;
