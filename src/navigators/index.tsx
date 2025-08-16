/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Image, useColorScheme} from 'react-native';
import React, {JSX, useEffect} from 'react';
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
import {
  navigationRef,
  onNavReady,
  setTopLevelNavigator,
} from '@app/navigators/navigationService';
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
  const {appConfigData} = useAppContext();
  let iconSource;
  switch (route?.name) {
    case tabNames.discoverTab:
      iconSource = icons.homeTab;
      break;
    case tabNames.shopTab:
      iconSource = icons.search;
      break;
    case tabNames.storesTab:
      iconSource = icons.store_inactive;
      break;
    case tabNames.orderTab:
      iconSource = icons.order_inactive;
      break;
    case tabNames.accountTab:
      iconSource = icons.account_inactive;
      break;
    default:
      iconSource = undefined;
  }
  return (
    <>
      {iconSource && (
        <Image
          source={iconSource}
          style={{
            width: 22,
            height: 22,
            tintColor: focused
              ? appConfigData?.primary_color
              : appConfigData?.secondary_color,
            resizeMode: 'contain',
          }}
        />
      )}
    </>
  );
};

// Helper to derive label (was previously in switch)
function getTabLabel(name: string, appConfigData: any) {
  const map: Record<string, number> = {
    [tabNames.discoverTab]: 0,
    [tabNames.shopTab]: 1,
    [tabNames.storesTab]: 2,
    [tabNames.orderTab]: 3,
    [tabNames.accountTab]: 4,
  };
  const idx = map[name];
  return appConfigData?.tabs?.[idx]?.tabLabel ?? '';
}

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
          header: () => <Header />,
          headerShown: true,
          headerStyle: {backgroundColor: appConfigData?.header_color},
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
          header: () => <Header />,
          headerShown: true,
          headerStyle: {backgroundColor: appConfigData?.header_color},
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
          header: () => <Header />,
          headerShown: true,
          headerStyle: {backgroundColor: appConfigData?.header_color},
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
    <Navigator>
      <Screen
        name={tabName}
        component={HomeScreen}
        options={{
          header: () => <Header />,
          headerShown: true,
          headerStyle: {backgroundColor: appConfigData?.header_color},
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
          header: () => <Header />,
          headerShown: true,
          headerStyle: {backgroundColor: appConfigData?.header_color},
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

  return (
    <Navigator
      screenOptions={({route}) => {
        const label = getTabLabel(route.name, appConfigData);
        return {
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: appConfigData?.primary_color,
          tabBarInactiveTintColor: appConfigData?.secondary_color,
          tabBarLabel: label ? label.toUpperCase() : '',
          tabBarLabelStyle: {
            fontFamily: theme.fonts.DMSans.medium,
            fontSize: theme.fontSize.font10,
          },
          tabBarIcon: (p: any) => <RenderTabBarIcon {...p} route={route} />,
          tabBarStyle: {
            backgroundColor: appConfigData?.footer_color,
            borderTopWidth: 0,
          },
          tabBarItemStyle: {
            justifyContent: 'center',
            alignItems: 'center',
          },
        };
      }}>
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

const RootContainer = () => {
  const currentColorScheme = useColorScheme();
  const currentTheme =
    currentColorScheme === 'dark' ? DefaultTheme : DefaultTheme;

  const deepLinkManager = DeepLinkManager.getInstance(navigationRef as any);

  useEffect(() => {
    setTopLevelNavigator(navigationRef);
    initializeEnvironment();
    deepLinkManager.initializeDeepLinks();
    return () => deepLinkManager.removeDeepLinkListener();
  }, []);

  return (
    <NavigationContainer
      theme={currentTheme}
      ref={navigationRef}
      onReady={onNavReady}>
      <RootStack />
    </NavigationContainer>
  );
};

// Define the flattened stack
const RootStack = () => {
  const {Navigator, Screen} = createNativeStackNavigator();
  return (
    <Navigator initialRouteName="Splash">
      {/* Previously inside CurrentNavigator */}
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
        options={{headerShown: false}}
      />
      <Screen
        name="Home"
        component={HomeTab}
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
      <Screen name={ScreenNames.poll} component={Poll} options={{headerShown: false}} />
      <Screen name={ScreenNames.quiz} component={Quiz} options={{headerShown: false}} />
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
        options={{headerShown: false}}
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
  );
};

export default RootContainer;
