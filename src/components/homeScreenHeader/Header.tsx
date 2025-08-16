/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {Image, StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {icons} from '@app/assets/icons';
import {theme} from '@app/constants';
import {useAppContext} from '@app/store/appContext';
import ScreenNames from '@app/constants/screenNames';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const Header = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {appConfigData} = useAppContext();
  const {cartItems} = useAppContext();

  const handleShopIconPress = () => {
    navigation?.navigate(ScreenNames.cartHomeScreen);
    console.log('Opening Shop cart');
  };

  const handleNotificationIconPress = () => {
    // navigation?.navigate(ScreenNames.webViewHomeScreen, {
    //   webUrl: 'https://discussion.hcl-x.com/portal/dologin',
    // });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end', // Align children along the main axis with space between them
      alignItems: 'center',
      alignSelf: 'center',
      paddingRight: 32, // Add padding to the left and right
      backgroundColor: appConfigData?.header_color,
    },
    headerLogo: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      left: 8,
      flexDirection: 'row',
      gap: 12,
      alignSelf: 'center',
    },
    otherIcon: {
      flexDirection: 'row',
      gap: 20,
      alignItems: 'center',
    },
    logo: {
      width: 19,
      height: 30,
      resizeMode: 'contain',
    },
    iconSize: {
      width: 24,
      height: 24,
    },
    shopIcon: {
      width: 20,
      height: 20,
    },
    logoText: {
      color: appConfigData?.primary_color,
      fontSize: theme.fontSize.font18,
      fontFamily: theme.fonts.DMSans.bold,
    },
    cartText: {
      color: appConfigData?.primary_text_color,
      fontSize: theme.fontSize.font10,
      fontFamily: theme.fonts.DMSans.regular,
      textAlign: 'center',
    },
    cartView: {
      position: 'absolute',
      top: -5,
      right: -5,
      backgroundColor: theme.colors.red,
      height: 15,
      width: 15,
      borderRadius: 15 / 2,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerLogo}>
        <TouchableOpacity activeOpacity={1} onPress={() => console.log('Logo')}>
          <Image
            source={icons.riseCartLogo}
            style={styles.logo}
          />
        </TouchableOpacity>
        <Text style={styles.logoText}>Rise Cart</Text>
      </View>

      <View style={styles.otherIcon}>
        <TouchableOpacity activeOpacity={1} onPress={handleNotificationIconPress}>
          {/* <Image source={icons.notificationBell} style={styles.iconSize} /> */}
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} onPress={handleShopIconPress}>
          <Image source={icons.shoppingCartIcon} style={styles.shopIcon} />
          {cartItems.length !== 0 && (
            <View style={styles.cartView}>
              <Text style={styles.cartText}>{cartItems.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
