/* eslint-disable react-native/no-inline-styles */
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import StorageService from '@app/utils/storageService';
import {userInfo} from '@app/constants/constants';
import {theme} from '@app/constants';
import {useAppContext} from '@app/store/appContext';
import DefaultHeader from '@app/components/ui-components/defaultHeader';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ScreenNames from '@app/constants/screenNames';
import {getCurrencySymbol} from '@app/utils/HelperFunction';
import {UserProfile} from '@app/model/profile/userProfile';
import BackAndContinueButton from '@app/components/productPurchase/BackAndContinueButtons';
import AddressForm from '@app/components/productPurchase/AddressForm';
import OrderSummary from '@app/components/productPurchase/OrderSummary';

export type Props = {
  route: any;
};

export type Address = {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  landMark: string;
  phoneNumber: string;
};

const AddressScreen: React.FC<Props> = ({route}) => {
  const {data} = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [userData, setUserData] = useState<UserProfile>();
  const {appConfigData} = useAppContext();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [address, setAddressState] = useState<Address>({
    name: '',
    address: '',
    city: '',
    state: 'Alabama',
    country: 'US',
    pincode: '',
    landMark: '',
    phoneNumber: '',
  });

  useEffect(() => {
    if (address.name && address.phoneNumber && address.address) {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, [address]);

  const setAddress = (field: keyof Address, value: string) => {
    setAddressState(prev => ({...prev, [field]: value}));
  };

  const getUserDetails = async () => {
    try {
      const userInfoData = await StorageService.getData(userInfo);
      const contents = JSON.parse(userInfoData as any) || {};
      const newData = contents?.data?.publish_viewProfile;
      setUserData(newData);
      const userName = `${newData?.first_name || ''} ${
        newData?.last_name || ''
      }`;
      setAddressState((prev: any) => ({...prev, name: userName}));
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const orderSummary = [
    {
      key: 'Original Subtotal (Incl. taxes)',
      value: `${getCurrencySymbol(data?.currency_code)}${parseFloat(
        data?.original_order_subtotal || 0,
      ).toFixed(2)}`,
    },
    {
      key: 'Total tax',
      value: `${getCurrencySymbol(data?.currency_code)}${data?.total_tax || 0}`,
    },
    {key: 'Shipping & Handling Charges ', value: '$0'},
    {
      key: 'Discount',
      value: `- ${getCurrencySymbol(data?.currency_code)}${parseFloat(
        data?.discounted_incl_tax || 0,
      ).toFixed(2)}`,
    },
    {
      key: 'Order Total',
      value: `${getCurrencySymbol(data?.currency_code)}${parseFloat(
        data?.subtotal_gross || 0,
      ).toFixed(2)}`,
    },
  ];

  const handleContinue = () => {
    navigation?.navigate(ScreenNames.shippingScreen, {
      shippingAddress: address,
      cartData: data,
      orderSummary: orderSummary,
    });
  };

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      gap: 20,
      marginTop: 1,
      paddingTop: 25,
      paddingHorizontal: theme.cardMargin.left,
      backgroundColor: appConfigData?.background_color,
    },
    sectionTitle: {
      fontFamily: theme.fonts.DMSans.semiBold,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.secondary_text_color,
    },
    title: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: '#838589',
    },
    inputText: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_color,
    },
    input: {
      backgroundColor: '#FAFAFA',
      borderRadius: theme.border.borderRadius,
      paddingHorizontal: 20,
      paddingVertical: theme.cardPadding.defaultPadding,
    },
  });

  return (
    <>
      <DefaultHeader header="Address" />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <Text style={styles.title}>Email ID</Text>
          <TextInput
            style={[styles.input, styles.inputText]}
            value={userData?.email}
            placeholder="Please enter your email here"
            placeholderTextColor={theme.colors.lightGray}
            editable={false}
          />
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <AddressForm address={address} setAddress={setAddress} />
          <OrderSummary data={orderSummary} />
        </ScrollView>
      </KeyboardAvoidingView>
      <BackAndContinueButton
        leftButtonText="Back"
        rightButtonText="Continue"
        isButtonDisabled={isButtonDisabled}
        handleLeftButton={() => navigation?.goBack()}
        handleRightButton={handleContinue}
      />
    </>
  );
};

export default AddressScreen;
