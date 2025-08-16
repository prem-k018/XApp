import {Text, View} from 'react-native';

import React, {useEffect} from 'react';
import {globalStyles} from '@app/constants';
import ScreenNames from '@app/constants/screenNames';
import {addEventForTracking} from '@app/services/tracking/rpiServices';
import { view } from '@app/constants/constants';
const NotificationsScreen: React.FC = () => {
  useEffect(() => {
    const appViewTracking = async () => {
      const data = {ContentType: ScreenNames.notificationsScreen,screenType:view};
      await addEventForTracking(data);
    };
    appViewTracking();
  }, []);
  return (
    <View style={globalStyles?.containerBase}>
      <Text>Notifications Screen</Text>
    </View>
  );
};

export default NotificationsScreen;
