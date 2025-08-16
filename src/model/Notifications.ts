import {Platform, Alert} from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  EventType,
  TimestampTrigger,
  TriggerType,
  AndroidChannel,
  Notification as NotifeeNotification,
} from '@notifee/react-native';
import DeepLinkManager from '@app/deeplinks/deeplinkManager';

type ScheduleExtraData = Record<string, any>;

class Notifications {
  private _initialized = false;
  private _channelId = 'reminders';
  private _foregroundUnsub: (() => void) | null = null;

  constructor() {
    // Fire and forget initialization; callers can still call init() manually.
    this.init().catch(e =>
      console.warn('[Notifications] init failed (will retry on first use)', e),
    );
  }

  public async init(): Promise<void> {
    if (this._initialized) return;
    await this.requestPermissionsNotifications();
    await this.createNotificationChannel();
    await this.configureNotifications();
    this._initialized = true;
  }

  /**
   * Sets up listeners for FCM foreground messages, notification open events,
   * cold start deep link handling, and Notifee press events.
   */
  public async configureNotifications(): Promise<void> {
    // Foreground FCM messages
    this._foregroundUnsub = messaging().onMessage(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        await this._displayImmediate(remoteMessage);
      },
    );

    // App in background, user taps notification
    messaging().onNotificationOpenedApp(
      (remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
        if (!remoteMessage?.data) return;
        const url =
          remoteMessage.data.deepLinkUrl ||
          remoteMessage.data.deepLink ||
            remoteMessage.data.deeplink;
        if (typeof url === 'string') {
          DeepLinkManager.getInstance().handleDeepLink({url});
        }
      },
    );

    // Cold start
    const initial = await messaging().getInitialNotification();
    if (initial?.data) {
      const url =
        initial.data.deepLinkUrl ||
        initial.data.deepLink ||
        initial.data.deeplink;
      if (typeof url === 'string') {
        setTimeout(
          () => DeepLinkManager.getInstance().handleDeepLink({url}),
          300,
        );
      }
    }

    // Notifee foreground press events
    notifee.onForegroundEvent(({type, detail}) => {
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
  }

  private async _displayImmediate(
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ): Promise<void> {
    const {notification, data} = remoteMessage;
    if (!notification) return;
    try {
      await notifee.displayNotification({
        title: notification.title,
        body: notification.body,
        data,
        android: {
          channelId: this._channelId,
          pressAction: {id: 'default'},
        },
      });
    } catch (e) {
      console.warn('[Notifications] display failed', e);
    }
  }

  public async createNotificationChannel(): Promise<void> {
    if (Platform.OS !== 'android') return;
    const channel: AndroidChannel = {
      id: this._channelId,
      name: 'Task reminder notifications',
      description: 'Reminder for any tasks',
      importance: AndroidImportance.HIGH,
      vibration: true,
    };
    try {
      await notifee.createChannel(channel);
    } catch (e) {
      console.warn('[Notifications] channel error', e);
    }
  }

  public async requestPermissionsNotifications(): Promise<void> {
    try {
      await messaging().requestPermission();
      if (Platform.OS === 'android') {
        try {
          await notifee.requestPermission();
        } catch {
          // Ignore; not critical
        }
      }
    } catch (error) {
      console.warn('[Notifications] permission error', error);
      Alert.alert(
        'Notification Permission',
        'Notifications are disabled. You can enable them in settings.',
      );
    }
  }

  /**
   * Schedule or immediately display a notification.
   * If date is past or within 3s, displays immediately.
   */
  public scheduleNotification(
    title: string,
    msg: string,
    date: Date,
    data: ScheduleExtraData = {},
  ): void {
    const ts = typeof date?.getTime === 'function' ? date.getTime() : Date.now();
    if (ts <= Date.now() + 3000) {
      notifee
        .displayNotification(this.buildNotifeeNotification(title, msg, data))
        .catch(e =>
          console.warn('[Notifications] immediate schedule error', e),
        );
      return;
    }

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: ts,
    };

    notifee
      .createTriggerNotification(
        this.buildNotifeeNotification(title, msg, data),
        trigger,
      )
      .catch(e => console.warn('[Notifications] trigger schedule error', e));
  }

  private buildNotifeeNotification(
    title: string,
    body: string,
    data: ScheduleExtraData,
  ): NotifeeNotification {
    return {
      title,
      body,
      data: {
        ...data,
        deepLinkUrl: data.deepLinkUrl, // stable key
      },
      android: {
        channelId: this._channelId,
        pressAction: {id: 'default'},
      },
    };
  }

  /**
   * List scheduled trigger notifications (local, future).
   */
  public async getScheduledNotifications(): Promise<any[]> {
    try {
      const triggers = await notifee.getTriggerNotifications();
      return triggers;
    } catch (e) {
      console.warn('[Notifications] list scheduled error', e);
      return [];
    }
  }

  /**
   * Cleanup foreground listener if needed (e.g., during hot reload disposal).
   */
  public destroy(): void {
    if (this._foregroundUnsub) {
      this._foregroundUnsub();
      this._foregroundUnsub = null;
    }
  }
}

export default new Notifications();
