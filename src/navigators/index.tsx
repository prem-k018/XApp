/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Image, Text, View, useColorScheme} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {icons} from '@app/assets/icons';
import {tabNames, theme} from '@app/constants';
import {TabBarIconPropsType} from './types';
import DeepLinkManager from '@app/deeplinks/deeplinkManager';
import ScreenNames from '@app/constants/screenNames';
import OnboardingFirstScreen from '@app/screens/onboarding/onboardingFirstScreen';
import OnboardingSecondScreen from '@app/screens/onboarding/onboardingSecondScreen';
import HomeScreen from '@app/screens/home/homeScreen';
import ArticleDetails from '@app/screens/articleDetails/articleDetails';
import Poll from '@app/screens/poll/poll';
import Quiz from '@app/screens/quiz/quiz';
import LoginScreen from '@app/screens/login/loginScreen';
import SignupScreen from '@app/screens/login/signupScreen';
import SplashScreen from '@app/screens/splash/splashScreen';
import {useAppContext} from '@app/store/appContext';
import ReelsScreens from '@app/screens/reels/reelsScreens';
import Header from '@app/components/homeScreenHeader/Header';
import NavigationService from './navigationService';
import EventDetails from '@app/screens/eventDetails/eventDetails';
import WebViewHomeScreen from '@app/screens/webView/webViewHomeScreen';
import QuizAnswerScreen from '@app/screens/quiz/quizAnswerScreen';
import StoresHomeScreen from '@app/screens/stores/StoresHomeScreen';
import AccountHomeScreen from '@app/screens/account/AccountHomeScreen';
import OrderHomeScreen from '@app/screens/orderScreen/OrderHomeScreen';
import StoriesScreens from '@app/screens/stories/storiesScreens';
import CategoriesScreen from '@app/screens/category/CategoriesScreen';
import ProductDetailsScreen from '@app/screens/productDetails/ProductDetailsScreen';
import ShopHomeScreen from '@app/screens/shop/shopHomeScreen';
import CartHomeScreen from '@app/screens/cart/CartHomeScreen';
import AddressScreen from '@app/screens/productPurchase/AddressScreen';
import TrailerVideoScreen from '@app/screens/productDetails/TrailerVideoScreen';
import EnvironmentSetup from '@app/screens/account/EnvironmentSetup';
import initializeEnvironment from '@app/utils/HelperFunction';
import SearchScreen from '@app/screens/search/SearchScreen';
import UserProfileScreen from '@app/screens/profile/UserProfileScreen';
import LoyaltyProfileScreen from '@app/screens/LoyaltyProfile/LoyaltyProfileScreen';
import EditProfileScreen from '@app/screens/profile/EditProfileScreen';
import RewardManagement from '@app/screens/rewards/RewardManagement';
import ShippingScreen from '@app/screens/productPurchase/ShippingScreen';
import PaymentScreen from '@app/screens/productPurchase/PaymentScreen';
import OrderConfirmedScreen from '@app/screens/productPurchase/OrderConfirmedScreen';

const RenderTabBarIcon = ({
  focused,
  route,
}: TabBarIconPropsType): JSX.Element => {
  let iconName;
  let tabLabel;
  const {appConfigData} = useAppContext();

  switch (route?.name) {
    case tabNames.discoverTab:
      iconName = icons.homeTab;
      tabLabel = appConfigData?.tabs[0].tabLabel;
      break;
    case tabNames.shopTab:
      iconName = icons.search;
      tabLabel = appConfigData?.tabs[1].tabLabel;
      break;
    case tabNames.storesTab:
      iconName = icons.store_inactive;
      tabLabel = appConfigData?.tabs[2].tabLabel;
      break;
    case tabNames.orderTab:
      iconName = icons.order_inactive;
      tabLabel = appConfigData?.tabs[3].tabLabel;
      break;
    case tabNames.accountTab:
      iconName = icons.account_inactive;
      tabLabel = appConfigData?.tabs[4].tabLabel;
      break;
    default:
      break;
  }
  return (
    <>
      <View style={{width: 24, height: 24, alignItems: 'center'}}>
        <Image
          source={iconName}
          style={{
            tintColor: focused
              ? appConfigData?.primary_color
              : appConfigData?.secondary_color,
          }}
        />
      </View>
      <Text
        style={{
          fontFamily: theme.fonts.DMSans.medium,
          fontSize: theme.fontSize.font10,
          color: focused
            ? appConfigData?.primary_color
            : appConfigData?.secondary_color,
          textAlign: 'center',
        }}>
        {tabLabel?.toUpperCase()}
      </Text>
    </>
  );
};

const AccountTabStack = (): JSX.Element => {
  const {Navigator, Screen} = createNativeStackNavigator();
  const tabName = GetTabName(tabNames.accountTab) ?? '';
  const {appConfigData} = useAppContext();

  return (
    <Navigator>
      <Screen
        name={tabName}
        component={AccountHomeScreen}
        options={{
          headerTitle: () => <Header />,
          headerStyle: {backgroundColor: appConfigData?.header_color},
          headerShadowVisible: false,
        }}
      />
    </Navigator>
  );
};

const StoresTabStack = (): JSX.Element => {
  const {Navigator, Screen} = createNativeStackNavigator();
  const tabName = GetTabName(tabNames.storesTab) ?? '';
  const {appConfigData} = useAppContext();

  return (
    <Navigator>
      <Screen
        name={tabName}
        component={StoresHomeScreen}
        options={{
          headerTitle: () => <Header />,
          headerStyle: {backgroundColor: appConfigData?.header_color},
          headerShadowVisible: false,
        }}
      />
    </Navigator>
  );
};

const OrderTabStack = (): JSX.Element => {
  const {Navigator, Screen} = createNativeStackNavigator();
  const tabName = GetTabName(tabNames.orderTab) ?? '';
  const {appConfigData} = useAppContext();

  return (
    <Navigator>
      <Screen
        name={tabName}
        component={OrderHomeScreen}
        options={{
          headerTitle: () => <Header />,
          headerStyle: {backgroundColor: appConfigData?.header_color},
          headerShadowVisible: false,
        }}
      />
    </Navigator>
  );
};

const HomeTabStack = (): JSX.Element => {
  const {Navigator, Screen} = createNativeStackNavigator();
  const tabName = GetTabName(tabNames.discoverTab) ?? '';
  const {appConfigData} = useAppContext();

  return (
    <Navigator initialRouteName={ScreenNames.homeScreen}>
      <Screen
        name={tabName}
        component={HomeScreen}
        options={{
          headerTitle: () => <Header />,
          headerStyle: {backgroundColor: appConfigData?.header_color},
          headerShadowVisible: false,
        }}
      />
    </Navigator>
  );
};

const ShopTabStack = (): JSX.Element => {
  const {Navigator, Screen} = createNativeStackNavigator();
  const tabName = GetTabName(tabNames.orderTab) ?? '';
  const {appConfigData} = useAppContext();

  return (
    <Navigator>
      <Screen
        name={tabName}
        component={ShopHomeScreen}
        options={{
          headerTitle: () => <Header />,
          headerStyle: {backgroundColor: appConfigData?.header_color},
          headerShadowVisible: false,
        }}
      />
    </Navigator>
  );
};

const LoginStack = (): JSX.Element => {
  const {Navigator, Screen} = createNativeStackNavigator();
  return (
    <Navigator initialRouteName={ScreenNames.loginScreen}>
      <Screen
        name={ScreenNames.loginScreen}
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Screen
        name={ScreenNames.signupScreen}
        component={SignupScreen}
        options={{headerShown: false}}
      />
    </Navigator>
  );
};

const SplashStack = (): JSX.Element => {
  const {Navigator, Screen} = createNativeStackNavigator();
  return (
    <Navigator initialRouteName={ScreenNames.splashScreen}>
      <Screen
        name={ScreenNames.splashScreen}
        component={SplashScreen}
        options={{headerShown: false}}
      />
    </Navigator>
  );
};

const OnboardingStack = (): JSX.Element => {
  const {Navigator, Screen} = createNativeStackNavigator();

  return (
    <Navigator initialRouteName={ScreenNames.onboardingFirstScreen}>
      <Screen
        name={ScreenNames.onboardingFirstScreen}
        component={OnboardingFirstScreen}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name={ScreenNames.onboardingSecondScreen}
        component={OnboardingSecondScreen}
        options={{
          headerShown: false,
        }}
      />
    </Navigator>
  );
};

function GetTabName(tabName: string): string | null {
  const {appConfigData} = useAppContext();

  for (const obj of appConfigData?.tabs ?? []) {
    if (obj.tabName === tabName) {
      return obj.tabLabel;
    }
  }
  return null; // Return null if no match is found
}

function CheckTabVisibility(tabName: string): boolean {
  const {appConfigData} = useAppContext();
  for (const obj of appConfigData?.tabs ?? []) {
    if (obj.tabName === tabName && obj.isHide === true) {
      return false;
    }
  }
  return true; // Return true if tab isHide are true
}

const HomeTab = (): JSX.Element => {
  const {Navigator, Screen} = createBottomTabNavigator();
  const {appConfigData} = useAppContext();

  const tabNavProps = {
    screenOptions: ({route}: BottomTabScreenProps<any>) => ({
      headerShown: false,
      tabBarHideOnKeyboard: true,

      tabBarStyle: [
        {
          backgroundColor: appConfigData?.footer_color,
          borderTopWidth: 0,
        },
      ],
      tabBarLabel: () => null,
      tabBarIcon: (tabBarIconProps: TabBarIconPropsType) =>
        RenderTabBarIcon({...tabBarIconProps, route}),
    }),
  };

  return (
    <Navigator {...tabNavProps}>
      {CheckTabVisibility(tabNames.discoverTab) && (
        <Screen name={tabNames.discoverTab} component={HomeTabStack} />
      )}

      {CheckTabVisibility(tabNames.shopTab) && (
        <Screen name={tabNames.shopTab} component={ShopTabStack} />
      )}

      {CheckTabVisibility(tabNames.storesTab) && (
        <Screen name={tabNames.storesTab} component={StoresTabStack} />
      )}

      {CheckTabVisibility(tabNames.orderTab) && (
        <Screen name={tabNames.orderTab} component={OrderTabStack} />
      )}

      {CheckTabVisibility(tabNames.accountTab) && (
        <Screen name={tabNames.accountTab} component={AccountTabStack} />
      )}
    </Navigator>
  );
};

const CurrentNavigator = (): JSX.Element => {
  const {Navigator, Screen} = createNativeStackNavigator();

  return (
    <Navigator>
      <Screen
        name="Splash"
        component={SplashStack}
        options={{headerShown: false}}
      />
      <Screen
        name="Login"
        component={LoginStack}
        options={{headerShown: false}}
      />
      <Screen
        name="Onboarding"
        component={OnboardingStack}
        options={{headerShown: false, headerBackVisible: false}}
      />
      <Screen
        name="Home"
        component={HomeTab}
        options={{
          headerShown: false,
          headerBackVisible: false,
        }}
      />
    </Navigator>
  );
};

const RootContainer = () => {
  const currentColorScheme = useColorScheme();
  const currentTheme =
    currentColorScheme === 'dark' ? DefaultTheme : DefaultTheme;
  const {Navigator, Screen} = createNativeStackNavigator();

  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const deepLinkManager = DeepLinkManager.getInstance(navigationRef);
  initializeEnvironment();

  useEffect(() => {
    // Initialize deep links
    NavigationService.setTopLevelNavigator(navigationRef);
    deepLinkManager.initializeDeepLinks();

    return () => {
      // Clean up deep link event listener
      deepLinkManager.removeDeepLinkListener();
    };
  });

  return (
    <NavigationContainer theme={currentTheme} ref={navigationRef}>
      <Navigator>
        <Screen
          name="Root"
          component={CurrentNavigator}
          options={{headerShown: false}}
        />
        <Screen
          name={ScreenNames.articleDetails}
          component={ArticleDetails}
          options={{headerShown: false}}
        />
        <Screen
          name={ScreenNames.eventDetails}
          component={EventDetails}
          options={{headerShown: false}}
        />
        <Screen
          name={ScreenNames.poll}
          component={Poll}
          options={{headerShown: false}}
        />
        <Screen
          name={ScreenNames.quiz}
          component={Quiz}
          options={{headerShown: false}}
        />
        <Screen
          name={ScreenNames.quizAnswer}
          component={QuizAnswerScreen}
          options={{headerShown: false}}
        />
        <Screen
          name={ScreenNames.reelsScreen}
          component={ReelsScreens}
          options={{headerShown: false}}
        />
        <Screen
          name={ScreenNames.onboardingSecondScreen}
          component={OnboardingSecondScreen}
          options={{
            headerShown: false,
          }}
        />
        <Screen
          name={ScreenNames.storiesScreen}
          component={StoriesScreens}
          options={{headerShown: false}}
        />
        <Screen
          name={ScreenNames.webViewHomeScreen}
          component={WebViewHomeScreen}
          options={{
            headerShown: true,
            autoHideHomeIndicator: true,
            headerTitle: 'Community',
            headerBackTitleVisible: false,
          }}
        />
        <Screen
          name={ScreenNames.categoryScreen}
          component={CategoriesScreen}
          options={{headerShown: false}}
        />
        <Screen
          name={ScreenNames.productDetails}
          component={ProductDetailsScreen}
          options={{headerShown: false}}
        />
        <Screen
          name={ScreenNames.cartHomeScreen}
          component={CartHomeScreen}
          options={{headerShown: false}}
        />
        <Screen
          name={ScreenNames.addressScreen}
          component={AddressScreen}
          options={{headerShown: false}}
        />
        <Screen
          name={ScreenNames.trailerVideoScreen}
          component={TrailerVideoScreen}
          options={{headerShown: false}}
        />
        <Screen
          name={ScreenNames.environmentSetup}
          component={EnvironmentSetup}
          options={{headerShown: false}}
        />
        <Screen
          name={ScreenNames.searchScreen}
          component={SearchScreen}
          options={{headerShown: false}}
        />
        <Screen
          name={ScreenNames.userProfileScreen}
          component={UserProfileScreen}
          options={{headerShown: false}}
        />
        <Screen
          name={ScreenNames.loyaltyProfileScreen}
          component={LoyaltyProfileScreen}
          options={{headerShown: false}}
        />
        <Screen
          name={ScreenNames.editProfileScreen}
          component={EditProfileScreen}
          options={{headerShown: false}}
        />
        <Screen
          name={ScreenNames.rewardsManagement}
          component={RewardManagement}
          options={{headerShown: false}}
        />
        <Screen
          name={ScreenNames.shippingScreen}
          component={ShippingScreen}
          options={{headerShown: false}}
        />
        <Screen
          name={ScreenNames.paymentScreen}
          component={PaymentScreen}
          options={{headerShown: false}}
        />
        <Screen
          name={ScreenNames.orderConfirmedScreen}
          component={OrderConfirmedScreen}
          options={{headerShown: false}}
        />
      </Navigator>
    </NavigationContainer>
  );
};

export default RootContainer;
