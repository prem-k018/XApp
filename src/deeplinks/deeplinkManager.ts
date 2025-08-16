import { Linking } from 'react-native';
import { NavigationContainerRef } from '@react-navigation/native';
import ScreenNames from '@app/constants/screenNames';

enum DeepLinkAction {
  HOME = 'home',
  SHOP = 'shop',
  USER_PROFILE = 'profile',
  ArticleDetails = 'article',
  EventDetails = 'event',
  VodDetails = "vod",
  poll = "poll",
  quiz = "quiz",
  EnvironmentSetup = 'EnvironmentSetup',
}

interface UrlParams {
  [key: string]: string;
}

class DeepLinkManager {
  private static instance: DeepLinkManager;
  private navigationRef: React.RefObject<NavigationContainerRef<any>>;

  private constructor(
    navigationRef: React.RefObject<NavigationContainerRef<any>>,
  ) {
    this.navigationRef = navigationRef;
  }

  static getInstance(
    navigationRef?: React.RefObject<NavigationContainerRef<any>>,
  ): DeepLinkManager {
    if (!DeepLinkManager.instance && navigationRef) {
      DeepLinkManager.instance = new DeepLinkManager(navigationRef);
    }
    return DeepLinkManager.instance;
  }

  initializeDeepLinks() {
    const linkEventListener = Linking.addEventListener(
      'url',
      this.handleDeepLink,
    );
    this.removeDeepLinkListener = () => {
      linkEventListener.remove();
    };

    Linking.getInitialURL().then(url => {
      if (url) {
        this.handleDeepLink({ url });
      }
    });
  }

  removeDeepLinkListener: () => void = () => { };

  handleDeepLink = ({ url }: { url: string }) => {
    const route = url.replace(/.*?:\/\//g, '');
    const urlParams = this.parseUrlParams(url);
    const data = urlParams.userid;
    switch (true) {
      case route.includes(DeepLinkAction.HOME):
        this.navigateTo('DiscoverTab');
        break;
      case route.includes(DeepLinkAction.ArticleDetails):
        if (data) {
          this.navigateTo(ScreenNames.articleDetails, { data: { Id: data } });
        }
        break;

      case route.includes(DeepLinkAction.EventDetails):
        this.navigateTo(ScreenNames.eventDetails, { data: { Id: data } });
        break;
      case route.includes(DeepLinkAction.VodDetails):
        this.navigateTo(ScreenNames.reelsScreen, { data: { Id: data } });
        break;
      case route.includes(DeepLinkAction.poll):
        this.navigateTo(ScreenNames.poll, { data: { Id: data } });
        break;
      case route.includes(DeepLinkAction.quiz):
        this.navigateTo(ScreenNames.quiz, { data: { Id: data } });
        break;
      default:
        console.warn(`Received unknown deep link: ${url}`);
    }
  };

  private navigateTo = (screen: string, params?: object) => {
    if (this.navigationRef.current) {
      this.navigationRef.current?.navigate(screen, params);
    } else {
      console.error('Navigation reference is not available.');
    }
  };

  private parseUrlParams(url: string): UrlParams {
    const params: UrlParams = {};
    const queryStart = url.indexOf('?');
    if (queryStart >= 0) {
      const query = url.slice(queryStart + 1);
      const queryParts = query.split('&');
      queryParts.forEach(part => {
        const [key, value] = part.split('=');
        if (key && value) {
          params[key] = decodeURIComponent(value);
        }
      });
    }
    return params;
  }
}

export default DeepLinkManager;
