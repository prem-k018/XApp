/**
 * App entry with BootSplash + Firebase Messaging + Notifee integration.
 */
import React, {JSX, useCallback, useEffect, useState} from 'react';
import {Platform, StatusBar} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import RootContainer from '@app/navigators';
import AnimatedNotification from '@app/components/PushNotificationBanner/pushNotificationBanner';
import DeepLinkManager from '@app/deeplinks/deeplinkManager';
import {AppProvider} from '@app/store/appContext';
import OrientationLocking from '@app/utils/orientationLocking';
import Notifications from '@app/model/Notifications';

export default function App(): JSX.Element {
  const [message, setMessage] = useState<string | null>(null);

  const subscribeToTopics = useCallback(async () => {
    for (const topic of ['article', 'poll', 'quiz']) {
      try {
        await messaging().subscribeToTopic(topic);
      } catch {}
    }
  }, []);

  const setupNotifications = useCallback(async () => {
    try {
      await messaging().requestPermission();
      if (Platform.OS === 'android') {
        try {
          await notifee.requestPermission();
        } catch {}
      }
      await notifee.createChannel({
        id: 'default',
        name: 'Default',
        importance: AndroidImportance.HIGH,
      });
      const token = await messaging().getToken();
      if (token) {
        await subscribeToTopics();
      }
      messaging().onTokenRefresh(() => {});
      messaging().onMessage(async rm => {
        setMessage(rm.notification?.body ?? null);
        if (rm.notification) {
          await notifee.displayNotification({
            title: rm.notification.title,
            body: rm.notification.body,
            android: {channelId: 'default', pressAction: {id: 'default'}},
          });
        }
      });
      messaging().onNotificationOpenedApp(notification => {
        const url = notification?.data?.deepLink;
        if (typeof url === 'string') DeepLinkManager.getInstance().handleDeepLink({url});
      });
      const initial = await messaging().getInitialNotification();
      if (initial?.data?.deepLink && typeof initial.data.deepLink === 'string') {
        DeepLinkManager.getInstance().handleDeepLink({url: initial.data.deepLink});
      }
    } catch (e) {
      console.warn('Notification setup failed', e);
    }
  }, [subscribeToTopics]);

  const init = useCallback(async () => {
    await setupNotifications();
    RNBootSplash.hide({fade: true});
  }, [setupNotifications]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => setMessage(null), 7000);
    return () => clearTimeout(id);
  }, [message]);

  useEffect(() => {
    Notifications.init?.();
  }, []);

  return (
    <OrientationLocking>
      <AppProvider>
        <GestureHandlerRootView style={{flex: 1}}>
          <StatusBar
           translucent={false}              
           backgroundColor="#000000"        
           barStyle="dark-content"         
         />
          <RootContainer />
          {message && <AnimatedNotification message={message} />}
        </GestureHandlerRootView>
      </AppProvider>
    </OrientationLocking>
  );
}
