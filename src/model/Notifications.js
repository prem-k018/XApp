import PushNotification from 'react-native-push-notification';
import { Platform, Alert } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import DeepLinkManager from '@app/deeplinks/deeplinkManager';
class Notifications {
  constructor() {
    this.requestPermissionsNotifications();
    this.configureNotifications();
    this.createNotificationChannel();
  }

  configureNotifications() {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        if (notification.data && notification.data.deepLinkUrl) {
          // Invoke the DeepLinkManager to handle the deep link
          DeepLinkManager.getInstance().handleDeepLink({ url: notification.data.deepLinkUrl });
        } else {
          console.warn('No deep link URL found in notification');
        }
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios' || Platform.Version >= 33,
      permissions: {
        alert: true,
        badge: false,
        sound: true,
      },
    });
  }

  createNotificationChannel() {
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'reminders',
          channelName: 'Task reminder notifications',
          channelDescription: 'Reminder for any tasks',
          importance: 4,
          vibrate: true,
        },
        (created) => console.log(`createChannel returned '${created}'`)
      );
    }
  }

  async requestPermissionsNotifications() {
    if (Platform.OS === 'android') {
      try {
        const apiLevel = Platform.Version;

        if (apiLevel >= 33) {
          const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
          
          if (result === RESULTS.GRANTED) {
            console.log('Notification permissions granted');
          } else {
            Alert.alert('Permission Denied', 'You need to enable notifications to receive updates.');
          }
        } else {
          console.log('No special permission needed for API level < 33');
        }
      } catch (error) {
        console.error('Error requesting permissions:', error);
        Alert.alert('Permission Error', 'Failed to request notification permissions.');
      }
    }
  }
  scheduleNotification(title, msg, date,data) {
    PushNotification.localNotificationSchedule({
      channelId: 'reminders',
      title: title,
      message: msg,
      date: date,
      allowWhileIdle: true,
      data:data,
      userInfo: {
        deepLinkUrl:data.deepLinkUrl // Include your deeplink URL here
      },
    });
  }

  getScheduledNotifications() {
    PushNotification.getScheduledLocalNotifications((rn) => {
      console.log('Scheduled Notifications --- ', rn);
    });
  }
}

export default new Notifications();