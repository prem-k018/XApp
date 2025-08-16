import React, {useEffect} from 'react';
import {View, Image} from 'react-native';
import {images} from '@app/assets/images';
import {globalStyles} from '@app/constants';
import StorageService from '@app/utils/storageService';
import {loginToken} from '@app/constants/constants';
import {StackActions} from '@react-navigation/native';

const SplashScreen = ({navigation}: any) => {
  useEffect(() => {
    async function checkLoginStatus() {
      const token = await StorageService.getData(loginToken);

      if (token) {
        navigation.dispatch(StackActions.replace('Home'));
      } else {
        navigation.dispatch(StackActions.replace('Login'));
      }
    }

    setTimeout(() => {
      checkLoginStatus();
    }, 3000); // Adjust the time as needed (5 seconds in this example)
  }, []);

  return (
    <View style={globalStyles.containerBase}>
      <Image source={images.splash} style={globalStyles.backgroundImage} />
    </View>
  );
};

export default SplashScreen;
