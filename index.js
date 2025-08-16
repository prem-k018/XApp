/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import DeepLinkManager from '@app/deeplinks/deeplinkManager';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  await notifee.createChannel({
    id: 'reminders',
    name: 'Task reminder notifications',
    importance: AndroidImportance.HIGH,
  });
  await notifee.displayNotification({
    title: remoteMessage.notification?.title,
    body: remoteMessage.notification?.body,
    data: remoteMessage.data,
    android: {channelId: 'reminders', pressAction: {id: 'default'}},
  });
});

// Notifee background press events
notifee.onBackgroundEvent(async ({type, detail}) => {
  if (type === EventType.PRESS) {
    const url =
      detail.notification?.data?.deepLinkUrl ||
      detail.notification?.data?.deepLink ||
      detail.notification?.data?.deeplink;
    if (typeof url === 'string') {
      DeepLinkManager.getInstance().handleDeepLink({url});
    }
  }
});

AppRegistry.registerComponent(appName, () => App);
