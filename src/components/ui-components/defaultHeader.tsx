import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {icons} from '@app/assets/icons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';
import SafeAreaUtils from '@app/utils/safeAreaUtils';

export type Props = {
  header?: string;
  icon1?: any;
  tintColor?: string;
  onPressIcon1?: () => void;
  text?: string;
  showBadged?: boolean;
  onBackPressScreen?: any;
};

const DefaultHeader: React.FC<Props> = ({
  header,
  onPressIcon1,
  icon1,
  tintColor,
  text,
  showBadged,
  onBackPressScreen,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {appConfigData, cartItems} = useAppContext();
  const safeFrame = SafeAreaUtils.getSafeAreaFrame();
  const safeAreaInsets = SafeAreaUtils.getSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: safeAreaInsets.top,
      paddingLeft: 8,
      backgroundColor: appConfigData?.header_color,
    },
    headingText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.secondary_text_color,
    },
    icon: {
      alignSelf: 'center',
    },
    iconStyle: {
      tintColor: tintColor,
    },
    rightSide: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: 15,
    },
    text: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font12,
      color: appConfigData?.primary_color,
    },
    cartText: {
      color: appConfigData?.primary_text_color,
      fontSize: theme.fontSize.font10,
      fontFamily: theme.fonts.DMSans.regular,
      textAlign: 'center',
    },
    cartView: {
      position: 'absolute',
      top: -8,
      right: -8,
      backgroundColor: theme.colors.red,
      height: 15,
      width: 15,
      borderRadius: 15 / 2,
    },
  });

  return (
    <View
      style={[
        styles.container,
        {width: safeFrame.width, height: safeAreaInsets.top + 64},
      ]}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.icon}
        onPress={() =>
          onBackPressScreen
            ? navigation.navigate(onBackPressScreen)
            : navigation?.goBack()
        }>
        <Image source={icons.backIcon} />
      </TouchableOpacity>
      <Text style={styles.headingText}>{header}</Text>
      <View style={styles.rightSide}>
        {icon1 && (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.icon}
            onPress={onPressIcon1}>
            <Image source={icon1} style={styles.iconStyle} />
            {showBadged && (
              <>
                {cartItems.length !== 0 && (
                  <View style={styles.cartView}>
                    <Text style={styles.cartText}>{cartItems.length}</Text>
                  </View>
                )}
              </>
            )}
          </TouchableOpacity>
        )}
        {text && (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.icon}
            onPress={onPressIcon1}>
            <Text style={styles.text}>{text}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default DefaultHeader;
