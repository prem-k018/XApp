import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';
import DefaultHeader from '@app/components/ui-components/defaultHeader';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import RadioToggle from '@app/components/ui-components/radioToggle';
import {icons} from '@app/assets/icons';
import StorageService from '@app/utils/storageService';
import {
  button,
  cartID,
  ecomProduct,
  makePayment,
  storedUserID,
  userEmail,
  userMemberId,
} from '@app/constants/constants';
import getMemberIssuedReawardList from '@app/services/rewards/issuedRewardList';
import {IssuedReward} from '@app/model/rewards/issuedRewardList';
import {FlatList} from 'react-native-gesture-handler';
import ApplyCouponItem from '@app/components/rewards/ApplyCouponItem';
import addOrRemoveCoupon from '@app/services/rewards/addOrRemoveCoupon';
import {AddOrRemoveCoupon} from '@app/model/rewards/addOrRemoveCoupon';
import BackAndContinueButton from '@app/components/productPurchase/BackAndContinueButtons';
import {getCurrencySymbol} from '@app/utils/HelperFunction';
import {APIConfig} from '@app/services/ApiConfig';
import LoadingScreen from '../loadingScreen/loadingScreen';
import NoDataScreen from '../loadingScreen/NoDataScreen';
import OrderSummary from '@app/components/productPurchase/OrderSummary';
import addProductToCart from '@app/services/productPurchase/cartManagement';
import {ErrorResponse} from '@app/services/serviceProvider';
import {addEventForTracking} from '@app/services/tracking/rpiServices';
import ScreenNames from '@app/constants/screenNames';
import StatusPopup from '@app/components/Popup/StatusPopup';

export type Props = {
  route: any;
};

const PaymentScreen: React.FC<Props> = ({route}) => {
  const {
    orderSummary,
    payUsingPoint,
    shippingAddress,
    billingAddress,
    cartData,
    points,
    pointConvertedAmount,
  } = route.params;
  const {appConfigData, confirmOrder} = useAppContext();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [paymentType, setPaymentType] = useState<string>('COD');
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [couponModalVisible, setCouponModalVisible] = useState<boolean>(false);
  const [myRewardsData, setMyRewardsData] = useState<IssuedReward[]>([]);
  const [myRewardsTotal, setMyRewardsTotal] = useState(Number.MAX_VALUE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [issuedCouponLoading, setIsuedCouponLoading] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [couponCode, setCouponCode] = useState<string>('');
  const [issuedCouponCode, setIssuedCouponCode] = useState<string>('');
  const [issuedCouponId, setIssuedCouponId] = useState<string>('');
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [couponLoading, setCouponLoading] = useState<boolean>(false);
  const [disableApplyCoupon, setDisableApplyCoupon] = useState<boolean>(false);
  const [isError, setIsError] = useState<string>('');
  const [couponData, setCouponData] = useState<AddOrRemoveCoupon>();
  const [localOrderSummary, setLocalOrderSummary] = useState(orderSummary);
  const [message, setMessage] = useState<any>();
  const [popUpVisible, setPopUpVisible] = useState<boolean>(false);
  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (couponModalVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [couponModalVisible]);

  useEffect(() => {
    if (orderSummary[orderSummary.length - 1].value === '$0.00') {
      setDisableApplyCoupon(true);
    }
  }, []);

  useEffect(() => {
    updateOrderSummary();
  }, [couponApplied, couponData]);

  useEffect(() => {
    fetchMyRewardCoupon();
  }, []);

  const paymentMethodOptions = [
    {label: 'Debit card and Credit card', value: 'CARD'},
    {label: 'UPI ie: Paytm, Google pe, Phone Pe, Bhim UPI', value: 'UPI'},
    {label: 'Netbanking', value: 'NB'},
    {label: 'Cash on Delivery', value: 'COD'},
    {label: 'Paypal', value: 'PP'},
  ];

  const pageSize = 10;

  const fetchMyRewardCoupon = async () => {
    setIsuedCouponLoading(true);
    try {
      const memberId: any = await StorageService.getData(userMemberId);
      const pagination = {start: pageIndex, rows: pageSize};
      const filterTerm = 'desc';
      const searchTerm = '';
      const rewardType = 'static_coupon';
      const categoryId = APIConfig.getOLCtCategoryId();

      const contents = await getMemberIssuedReawardList(
        memberId,
        pagination,
        filterTerm,
        searchTerm,
        'issued',
        rewardType,
        categoryId,
      );

      if (
        'data' in contents &&
        contents?.data?.users_getMemberIssuedRewardList?.rewardList
      ) {
        const newData =
          contents?.data?.users_getMemberIssuedRewardList?.rewardList;
        setMyRewardsData(prevData => [...prevData, ...newData]);
        setPageIndex(prevIndex => prevIndex + 1);

        const total =
          contents?.data?.users_getMemberIssuedRewardList?.total?.filtered;
        if (total !== undefined && total !== null) {
          setMyRewardsTotal(total);
        }
        setIsuedCouponLoading(false);
      } else {
        console.log('Something went wrong!');
      }
    } catch (error: any) {
      console.log(error.message);
      setIsuedCouponLoading(false);
    } finally {
      setIsuedCouponLoading(false);
    }
  };

  const handlePaymentSelect = (value: string) => {
    setPaymentType(value);
  };

  const handleTermsToggle = () => {
    setAcceptedTerms(!acceptedTerms);
  };

  const onClose = () => {
    setCouponModalVisible(false);
  };

  const updateData = () => {
    if (myRewardsData.length < myRewardsTotal && !issuedCouponLoading) {
      fetchMyRewardCoupon();
    }
  };

  const handleCouponDetails = (couponCode: string, couponId: string) => {
    console.log('Received couponCode:', couponCode);
    console.log('Received issuedRewardId:', couponId);
    setIssuedCouponCode(couponCode);
    setIssuedCouponId(couponId);
    handleAddOrRemoveCoupon('completed', couponCode, couponId);
    setCouponApplied(true);
  };

  const handleAddOrRemoveCoupon = async (
    status: string,
    issuedCouponCode: string,
    issuedCouponId: string,
    assignCouponId?: string,
  ) => {
    try {
      setCouponLoading(true);
      const cartId: any = await StorageService.getData(cartID);
      const memberId: any = await StorageService.getData(userMemberId);
      const couponCode: any = issuedCouponCode;
      const issuedRewardId: any = issuedCouponId;

      const contents = await addOrRemoveCoupon(
        cartId,
        memberId,
        couponCode,
        issuedRewardId,
        status,
        assignCouponId,
      );
      if ('data' in contents && contents?.data?.publish_addOrRemoveCoupon) {
        const newData = contents.data.publish_addOrRemoveCoupon;
        console.log('Coupon Applied Message==>', newData);
        setCouponData(newData);
        if (newData?.statusCode === 200) {
          setCouponModalVisible(false);
        }
        if (newData?.statusCode !== 200) {
          setIsError(newData?.msg);
          setCouponApplied(false);
        }
        setCouponLoading(false);
      } else {
        console.log('Something went Wrong!');
      }
    } catch (err: any) {
      console.log(err.message);
      setIsError(err.message);
      setCouponLoading(false);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRetry = () => {
    fetchMyRewardCoupon();
  };

  const handleApplyCoupon = () => {};

  const handleRemoveCoupon = () => {
    const assignedCouponId = couponData?.data?.assign_coupon_id;
    handleAddOrRemoveCoupon(
      'issued',
      issuedCouponCode,
      issuedCouponId,
      assignedCouponId,
    );
    setCouponApplied(false);
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    return (
      <ApplyCouponItem
        data={item}
        index={index}
        handleCouponDetails={handleCouponDetails}
      />
    );
  };

  const HeaderComponent = () => {
    return (
      <View style={{gap: theme.cardPadding.mediumSize}}>
        <View style={styles.buttonView}>
          <Text style={styles.applyCoupon}>Apply Coupon</Text>
          <TouchableOpacity activeOpacity={1} onPress={onClose}>
            <Image
              source={icons.cross}
              tintColor={appConfigData?.secondary_text_color}
            />
          </TouchableOpacity>
        </View>
        <View>
          <View style={styles.buttonView}>
            <TextInput
              ref={searchInputRef}
              style={styles.couponInput}
              placeholder="Enter coupon code"
              placeholderTextColor={theme.colors.lightGray}
              value={couponCode}
              editable={false}
              onChangeText={setCouponCode}
              onSubmitEditing={handleApplyCoupon}
              maxLength={20}
            />
            <TouchableOpacity
              activeOpacity={1}
              onPress={handleApplyCoupon}
              style={styles.applyButton}>
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableOpacity>
          </View>
          {isError && (
            <View style={[styles.buttonView, {paddingTop: 4}]}>
              <Image source={icons.alertInfo} style={styles.errorIcon} />
              <Text style={styles.errorMessage}>{isError}</Text>
            </View>
          )}
        </View>
        <View style={styles.divider} />
      </View>
    );
  };

  const FooterComponent = () => {
    return (
      issuedCouponLoading && (
        <View style={styles.loading}>
          <ActivityIndicator size="small" />
        </View>
      )
    );
  };

  const dstCoupon = {
    key: 'Discount(Coupon)',
    value: `- ${getCurrencySymbol(cartData?.currency_code)}${
      couponData?.data?.discount_on_total_price
        ? couponData?.data.discount_on_total_price.toFixed(2)
        : '0.00'
    }`,
    hidden: !couponApplied,
  };

  const updateOrderSummary = () => {
    const couponDiscount = couponData?.data?.discount_on_total_price
      ? couponData?.data.discount_on_total_price
      : 0;

    const originalOrderTotal = Number(
      orderSummary[orderSummary.length - 1].value.slice(1),
    );
    const adjustedOrderTotal = couponApplied
      ? originalOrderTotal - couponDiscount
      : originalOrderTotal;

    let newOrderSummary = [...orderSummary];

    if (couponApplied) {
      newOrderSummary.splice(newOrderSummary.length - 1, 0, dstCoupon);
      console.log('Discount final Coupon ==>', dstCoupon);
    } else {
      newOrderSummary = newOrderSummary.filter(
        (item: any) => item.key !== 'Discount(Coupon)',
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

  const updateAddress = async () => {
    const storedCartID = await StorageService.getData(cartID);
    const emailId = await StorageService.getData(userEmail);

    const shippingAddressData = {
      title: shippingAddress?.name,
      last_name: shippingAddress?.name,
      street_name: shippingAddress?.address,
      postal_code: shippingAddress?.pincode,
      email: emailId,
      additional_address_info: shippingAddress?.landMark,
      mobile: shippingAddress?.phoneNumber,
      city: shippingAddress?.city,
      state: 'Alabama',
      country: 'US',
    };

    const billingAddressData = {
      title: billingAddress?.name,
      last_name: billingAddress?.name,
      street_name: billingAddress?.address,
      postal_code: billingAddress?.pincode,
      email: emailId,
      additional_address_info: billingAddress?.landMark,
      mobile: billingAddress?.phoneNumber,
      city: billingAddress?.city,
      state: 'Alabama',
      country: 'US',
    };

    const address = {
      shipping_address: shippingAddressData,
      billing_address: billingAddressData,
    };

    try {
      const shippingResult = await addProductToCart(
        undefined,
        storedCartID ?? '',
        undefined,
        undefined,
        undefined,
        {shipping_address: shippingAddressData},
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        false,
      );
      console.log(shippingResult);

      const billingResult = await addProductToCart(
        undefined,
        storedCartID ?? '',
        undefined,
        undefined,
        undefined,
        {billing_address: billingAddressData},
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        false,
      );
      console.log(billingResult);
      return billingResult;
    } catch (err: any) {
      console.log(err);

      throw {
        message: err.message,
      } as ErrorResponse;
    }
  };

  const updatePaymentMethod = async () => {
    const storedCartID = await StorageService.getData(cartID);

    try {
      const result = await addProductToCart(
        undefined,
        storedCartID ?? '',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        paymentType,
      );
      return result;
    } catch (err: any) {
      throw {
        message: err.message,
      } as ErrorResponse;
    }
  };

  const placeOrder = async () => {
    const storedCartID = await StorageService.getData(cartID);
    const userID = await StorageService.getData(storedUserID);
    const cartTotalAmount =
      localOrderSummary[localOrderSummary.length - 1]?.value;
    const memberId: any = await StorageService.getData(userMemberId);
    const pointUsed = payUsingPoint ? points : undefined;
    const pointConvertAmount = payUsingPoint ? pointConvertedAmount : undefined;

    try {
      const result = await addProductToCart(
        undefined, // Initialize
        storedCartID ?? '', // Cart Id
        undefined, // Product Id
        undefined, // Variant Id
        undefined, // Quantity
        undefined, // Address
        userID ?? '', // User ID
        cartTotalAmount, // Cart Total
        undefined, // Payment Method
        pointUsed, // Point
        memberId, // Member Id
        pointConvertAmount, // Point Converted Amount
        true, // Place Order
      );
      return result;
    } catch (err: any) {
      throw {
        message: err.message,
      } as ErrorResponse;
    }
  };

  const handleConfirmOrder = async () => {
    const button_Data = {
      ContentType: ecomProduct,
      screenType: button,
      button_name: 'order_confirmation_button',
    };
    addEventForTracking(button_Data);
    setIsLoading(true);
    try {
      setIsLoading(true);
      const result = await updateAddress();

      if (
        'data' in result &&
        result.data.publish_addProductToCart.statusCode === 200
      ) {
        try {
          const response = await updatePaymentMethod();

          if (
            'data' in response &&
            response.data.publish_addProductToCart.statusCode === 200
          ) {
            try {
              const order = await placeOrder();

              if (
                'data' in order &&
                order.data.publish_addProductToCart.statusCode === 200
              ) {
                const loginEmail = await StorageService.getData(userEmail);

                const orderTracingData = {
                  ContentType: ecomProduct,
                  transaction_Id: order.data.publish_addProductToCart?.order_id,
                  screenType: makePayment,
                  payment_method: paymentType,
                  cart_id: order.data?.publish_addProductToCart?.cart_id,
                  shipping_address: `firstName :${shippingAddress?.name} | lastName: ${shippingAddress?.name} | addressLine1 : ${shippingAddress?.address} | city: ${shippingAddress?.city}| country: ${shippingAddress?.county} "`,
                  shipping_email: loginEmail,
                  shipping_phone_number: shippingAddress?.phoneNumber,
                  billing_address: `firstName :${shippingAddress?.name} | lastName: ${shippingAddress?.name} | addressLine1 : ${shippingAddress?.address} | city: ${shippingAddress?.city}| country: ${shippingAddress?.county} "`,
                  billing_email: loginEmail,
                  billing_phone_number: shippingAddress?.phoneNumber,
                  order_id: order.data?.publish_addProductToCart?.order_number,
                  cart_total_Items: cartData?.cart_total_Items,
                  estimated_tax: '',
                  total_amount:
                    localOrderSummary[localOrderSummary.length - 1]?.value,
                  currency: cartData?.currency_code,
                  discount_amount: '',
                  discount_coupon:
                    couponData?.data?.discount_on_total_price ?? '',
                  shipping_cost: '0',
                  // products: data?.products,
                };
                addEventForTracking(orderTracingData);
                setIsLoading(false);

                confirmOrder();
                navigation?.navigate(ScreenNames.orderConfirmedScreen, {
                  orderId: order.data.publish_addProductToCart.order_id,
                  orderNumber: order.data.publish_addProductToCart.order_number,
                });
              } else {
                setPopUpVisible(true);
                setMessage({
                  topic: 'Order Purchase Status',
                  message: order.data?.publish_addProductToCart?.msg,
                  status: 'failed',
                });
              }
              setIsLoading(false);
            } catch (err: any) {
              setPopUpVisible(true);
              setMessage({
                topic: 'Profile Update Status',
                message: err?.message,
                status: 'failed',
              });
              setIsLoading(false);
            }
          }
          setIsLoading(false);
        } catch (err: any) {
          setIsLoading(false);
        }
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    console.log('handleContinue');
    handleConfirmOrder();
  };

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      marginTop: 1,
      backgroundColor: appConfigData?.background_color,
      paddingHorizontal: theme.cardMargin.left,
      gap: theme.cardPadding.largeSize,
    },
    totalAmountView: {
      backgroundColor: '#FAFAFA',
      paddingHorizontal: theme.cardPadding.mediumSize,
      paddingVertical: theme.cardMargin.top,
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderRadius: theme.border.borderRadius,
    },
    amountText: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
    },
    couponText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font16,
      color: disableApplyCoupon ? '#C4C5C4' : theme.colors.red,
    },
    paymentMethod: {
      fontFamily: theme.fonts.DMSans.semiBold,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.secondary_text_color,
    },
    info: {
      flex: 1,
      fontFamily: theme.fonts.Inter.regular,
      fontSize: theme.fontSize.font14,
      color: '#5C6574',
    },
    termsView: {
      flexDirection: 'row',
      gap: theme.cardMargin.right,
    },
    checkBox: {
      height: 20,
      width: 20,
      borderRadius: 3,
      borderColor: acceptedTerms
        ? appConfigData?.secondary_text_color
        : '#CED3D9',
      borderWidth: theme.border.borderWidth,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
    conditionText: {
      textDecorationLine: 'underline',
      color: appConfigData?.primary_color,
    },
    buttonView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    applyButton: {
      width: '28%',
      height: 50,
      borderRadius: theme.border.borderRadius,
      paddingVertical: 15,
      backgroundColor: '#C4C5C4',
    },
    buttonText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.primary_text_color,
      textAlign: 'center',
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popupContainer: {
      width: '100%',
      height: '66.5%',
      backgroundColor: appConfigData?.background_color,
      paddingVertical: theme.cardPadding.mediumSize,
      paddingHorizontal: theme.cardMargin.left,
      gap: theme.cardPadding.mediumSize,
    },
    flatListView: {
      gap: 24,
    },
    loading: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    applyCoupon: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font20,
      color: appConfigData?.secondary_text_color,
    },
    couponInput: {
      height: 50,
      width: '70%',
      paddingHorizontal: 14,
      fontFamily: theme.fonts.Inter.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
      borderWidth: theme.border.borderWidth,
      borderColor: theme.colors.lightGray,
      borderRadius: theme.border.borderRadius,
    },
    divider: {
      borderBottomWidth: 1.5,
      borderBottomColor: theme.colors.grayScale4,
    },
    couponCodeText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font18,
      color: appConfigData?.primary_color,
    },
    errorMessage: {
      flex: 1,
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.red,
    },
    errorIcon: {
      height: 20,
      width: 20,
      tintColor: theme.colors.red,
      marginRight: 4,
    },
    details: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
    },
    bottomView: {
      justifyContent: 'flex-end',
      backgroundColor: appConfigData?.background_color,
    },
    orderSummaryView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: theme.cardPadding.smallXsize,
      borderBottomWidth: theme.border.borderWidth,
      borderBottomColor: '#EDEDED',
    },
  });

  return isLoading ? (
    <>
      <DefaultHeader header="Payment Method" />
      <ActivityIndicator
        style={{flex: 1}}
        color={appConfigData?.primary_color}
        size={'large'}
      />
    </>
  ) : (
    <>
      <DefaultHeader header="Payment Method" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        <View style={styles.totalAmountView}>
          <Text style={styles.amountText}>Total Amount</Text>
          <Text
            style={[styles.amountText, {fontFamily: theme.fonts.DMSans.bold}]}>
            {localOrderSummary[localOrderSummary.length - 1]?.value}
          </Text>
        </View>
        {couponLoading ? (
          <ActivityIndicator size={'small'} color={'grey'} />
        ) : (
          <>
            {couponApplied ? (
              <View style={{gap: theme.cardPadding.defaultPadding}}>
                <Text style={styles.couponText}>Coupon Applied</Text>
                <View style={styles.buttonView}>
                  <Text style={styles.couponCodeText}>{issuedCouponCode}</Text>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={handleRemoveCoupon}>
                    <Image
                      source={icons.cross}
                      tintColor={appConfigData?.secondary_text_color}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text
                style={styles.couponText}
                onPress={() => {
                  !disableApplyCoupon &&
                    (setCouponModalVisible(true), setIsError(''));
                }}>
                Have a Coupon Code?
              </Text>
            )}
          </>
        )}
        <Text style={styles.paymentMethod}>Choose Payment Method</Text>
        <RadioToggle
          options={paymentMethodOptions}
          onSelect={handlePaymentSelect}
          initialSelected="COD"
          gap={theme.cardPadding.largeSize}
          disabled={true}
        />
        <Text style={styles.info}>
          Your personal data will be used to process your order, support your
          experience throughout this website, and for other purposes described
          in our privacy policy.
        </Text>
        <View style={styles.termsView}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleTermsToggle}
            style={styles.checkBox}>
            {acceptedTerms && (
              <Image
                source={icons.right}
                tintColor={appConfigData?.secondary_text_color}
              />
            )}
          </TouchableOpacity>
          <Text style={styles.info}>
            I have read and agree{' '}
            <Text style={styles.conditionText}>terms and conditions</Text> *
          </Text>
        </View>
        <OrderSummary data={localOrderSummary} />
        {couponModalVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
            visible={couponModalVisible}>
            <View style={styles.modalBackground}>
              <View style={styles.popupContainer}>
                <HeaderComponent />
                {issuedCouponLoading ? (
                  <LoadingScreen
                    isLoading={issuedCouponLoading}
                    error={isError}
                    onRetry={handleRetry}
                  />
                ) : myRewardsData.length > 0 ? (
                  <FlatList
                    contentContainerStyle={styles.flatListView}
                    showsVerticalScrollIndicator={false}
                    data={myRewardsData}
                    renderItem={renderItem}
                    onEndReached={updateData}
                    onEndReachedThreshold={0.5}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={<FooterComponent />}
                  />
                ) : (
                  myRewardsData.length === 0 && <NoDataScreen />
                )}
              </View>
            </View>
          </Modal>
        )}
        {popUpVisible && (
          <StatusPopup
            data={message}
            visible={popUpVisible}
            onClose={() => setPopUpVisible(false)}
            isLoading={isLoading}
          />
        )}
      </ScrollView>
      <BackAndContinueButton
        leftButtonText="Back"
        rightButtonText="Continue"
        isButtonDisabled={acceptedTerms}
        handleLeftButton={() => navigation?.goBack()}
        handleRightButton={handleContinue}
      />
    </>
  );
};

export default PaymentScreen;
