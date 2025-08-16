import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';
import {icons} from '@app/assets/icons';
import DefaultHeader from '@app/components/ui-components/defaultHeader';
import RadioToggle from '@app/components/ui-components/radioToggle';
import StorageService from '@app/utils/storageService';
import {userMemberId} from '@app/constants/constants';
import getUserOLProfileData from '@app/services/profile/userOLProfile';
import {UserPointsInfo} from '@app/model/profile/userOLProfile';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ScreenNames from '@app/constants/screenNames';
import BackAndContinueButton from '@app/components/productPurchase/BackAndContinueButtons';
import {getCurrencySymbol} from '@app/utils/HelperFunction';
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

const addressOptions = [
  {label: 'Same as shipping address', value: 'shipping'},
  {label: 'Use a different billing address', value: 'billing'},
];

const ShippingScreen: React.FC<Props> = ({route}) => {
  const {shippingAddress, cartData, orderSummary} = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {appConfigData} = useAppContext();
  const [addressType, setAddressType] = useState<string>('shipping');
  const [payUsingPoint, setPayUsingPoint] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [userOLPoint, setUserOLPoint] = useState<UserPointsInfo>();
  const [localOrderSummary, setLocalOrderSummary] = useState(orderSummary);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [billingAdrressVisible, setBillingAddressVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>(
    addressOptions[0]?.value,
  );

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
    if (!billingAdrressVisible) {
      setIsButtonDisabled(true);
    } else if (address.name && address.phoneNumber && address.address) {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, [address, billingAdrressVisible]);

  const setAddress = (field: keyof Address, value: string) => {
    setAddressState(prev => ({...prev, [field]: value}));
  };

  useEffect(() => {
    getUserOLData();
  }, []);

  useEffect(() => {
    updateOrderSummary();
  }, [payUsingPoint, userOLPoint]);

  const handleAddressSelect = (value: string) => {
    if (value !== selectedOption) {
      setSelectedOption(value);
      setAddressType(value);
      setBillingAddressVisible(!billingAdrressVisible);
    }
  };

  async function getUserOLData() {
    try {
      setIsDisabled(true);
      const memberId = await StorageService.getData(userMemberId);
      const contents = await getUserOLProfileData(memberId as string);
      if ('data' in contents && contents?.data?.users_userOLProfile) {
        setUserOLPoint(contents?.data?.users_userOLProfile?.userPointsInfo);
      } else {
        console.log('Something went wrong!!');
      }
    } catch (err: any) {
      console.log(err.message);
    } finally {
      setIsDisabled(false);
    }
  }

  const pointsRequired =
    cartData?.total_price /
    (userOLPoint?.convertedPoints ? userOLPoint?.convertedPoints : 0);
  const points =
    (userOLPoint?.activePoints ? userOLPoint?.activePoints : 0) > pointsRequired
      ? pointsRequired
      : userOLPoint?.activePoints || 0;

  const pointUsedAmount =
    points * (userOLPoint?.convertedPoints ? userOLPoint?.convertedPoints : 0);

  const pointUsed = {
    key: 'Points Used',
    value: `- ${getCurrencySymbol(cartData?.currency_code)}${parseFloat(
      pointUsedAmount.toString(),
    ).toFixed(2)}`,
    hidden: !payUsingPoint,
  };

  const updateOrderSummary = () => {
    const originalOrderTotal = parseFloat(cartData?.subtotal_gross || '0');
    const adjustedOrderTotal = payUsingPoint
      ? originalOrderTotal - pointUsedAmount
      : originalOrderTotal;

    let newOrderSummary = [...orderSummary];

    if (payUsingPoint) {
      newOrderSummary.splice(newOrderSummary.length - 1, 0, pointUsed);
    } else {
      newOrderSummary = newOrderSummary.filter(
        (item: any) => item.key !== 'Points Used',
      );
    }

    newOrderSummary = newOrderSummary.map((item: any) => {
      if (item.key === 'Order Total') {
        return {
          ...item,
          value: `${getCurrencySymbol(cartData?.currency_code)}${parseFloat(
            adjustedOrderTotal as any,
          ).toFixed(2)}`,
        };
      }
      return item;
    });

    setLocalOrderSummary(newOrderSummary);
  };

  const handleContinue = () => {
    const billingAddressToPass =
      addressType === 'shipping' ? shippingAddress : address;

    navigation?.navigate(ScreenNames.paymentScreen, {
      orderSummary: localOrderSummary,
      payUsingPoint: payUsingPoint,
      shippingAddress: shippingAddress,
      billingAddress: billingAddressToPass,
      cartData: cartData,
      points: points,
      pointConvertedAmount: pointUsedAmount,
    });
  };

  const handleEditAddress = () => {
    navigation?.goBack();
  };

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      marginTop: 1,
      paddingTop: theme.cardPadding.largeSize,
      paddingHorizontal: theme.cardMargin.left,
      backgroundColor: appConfigData?.background_color,
    },
    headingView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    headingText: {
      fontFamily: theme.fonts.DMSans.semiBold,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.secondary_text_color,
      marginBottom: theme.cardMargin.xSmall,
    },
    details: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
    },
    billingAddress: {
      paddingTop: theme.cardPadding.carMargin,
      gap: theme.cardPadding.mediumSize,
    },
    addressView: {
      flexDirection: 'row',
      gap: theme.cardMargin.xSmall,
    },
    circle: {
      height: 20,
      width: 20,
      borderWidth: theme.border.borderWidth,
      borderColor: appConfigData?.secondary_text_color,
      borderRadius: 20 / 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dot: {
      height: 10,
      width: 10,
      backgroundColor: appConfigData?.secondary_text_color,
      borderRadius: 10 / 2,
    },
    pointView: {
      marginVertical: theme.cardPadding.largeSize,
      borderWidth: theme.border.borderWidth,
      borderColor: '#CED3D9',
      paddingHorizontal: theme.cardMargin.left,
      paddingVertical: theme.cardMargin.bottom,
      borderRadius: theme.border.borderRadius,
    },
    totalPointsText: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font12,
      color: appConfigData?.primary_color,
      marginTop: theme.cardPadding.smallXsize,
      paddingLeft: 30,
    },
  });

  return (
    <>
      <DefaultHeader header="Shipping Details" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headingView}>
          <Text style={styles.headingText}>Deliver to</Text>
          <TouchableOpacity activeOpacity={1} onPress={handleEditAddress}>
            <Image source={icons.edit} />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={[styles.headingText, {fontSize: theme.fontSize.font14}]}>
            {shippingAddress?.name}
          </Text>
          <Text style={styles.details}>{shippingAddress?.address}</Text>
          <Text style={styles.details}>
            {shippingAddress?.city && `${shippingAddress?.city}, `}
            {shippingAddress?.state}{' '}
            {shippingAddress?.pincode && `- ${shippingAddress?.pincode}`}
          </Text>
          <Text style={styles.details}>
            Landmark : {shippingAddress?.landMark}
          </Text>
          <Text style={styles.details}>
            Contact No. : {shippingAddress?.phoneNumber}
          </Text>
        </View>
        <View style={styles.billingAddress}>
          <Text style={[styles.headingText, {marginBottom: 0}]}>
            Billing Address
          </Text>
          <RadioToggle
            options={addressOptions}
            onSelect={handleAddressSelect}
            initialSelected="shipping"
            gap={theme.cardPadding.smallXsize}
          />
          {billingAdrressVisible && (
            <AddressForm address={address} setAddress={setAddress} />
          )}
        </View>
        <View style={styles.pointView}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              !isDisabled && setPayUsingPoint(!payUsingPoint);
            }}
            style={styles.addressView}>
            <View
              style={[
                styles.circle,
                !payUsingPoint && {borderColor: '#CED3D9'},
              ]}>
              {payUsingPoint && <View style={styles.dot} />}
            </View>
            <Text style={[styles.details, {flex: 1}]}>
              Use your <Image source={icons.loyaltyPointIcon} />{' '}
              <Text style={{fontFamily: theme.fonts.DMSans.extraBold}}>
                {points}
              </Text>{' '}
              PTS for this purchase
            </Text>
          </TouchableOpacity>
          <Text style={styles.totalPointsText}>
            You have{' '}
            <Text style={{fontFamily: theme.fonts.DMSans.extraBold}}>
              {userOLPoint?.activePoints}
            </Text>{' '}
            PTS in your wallets. 100Pts = 1USD
          </Text>
        </View>
        <OrderSummary data={localOrderSummary} />
      </ScrollView>
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

export default ShippingScreen;
