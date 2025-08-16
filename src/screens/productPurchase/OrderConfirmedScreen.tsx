import {
  ActivityIndicator,
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAppContext} from '@app/store/appContext';
import {Order} from '@app/model/productPurchase/orderDetail';
import {tabNames, theme} from '@app/constants';
import LoadingScreen from '../loadingScreen/loadingScreen';
import OrderedItems from '@app/components/productPurchase/OrderedItem';
import {getCurrencySymbol, getDateOfBirth} from '@app/utils/HelperFunction';
import FeaturedCarousel from '@app/components/home/FeaturedCarousel';
import OrderSummary from '@app/components/productPurchase/OrderSummary';
import AddressDetails from '@app/components/productPurchase/AddressDetails';
import getEcomOrderDetail from '@app/services/productPurchase/orderDetail';
import getTransactionReward from '@app/services/productPurchase/transactionReward';
import {
  Points,
  TransactionRewards,
} from '@app/model/productPurchase/transactionReward';
import {icons} from '@app/assets/icons';
import {StackActions, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ScreenNames from '@app/constants/screenNames';

export type Props = {
  route: any;
};

const OrderConfirmedScreen: React.FC<Props> = ({route}) => {
  const {appConfigData} = useAppContext();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {orderId, orderNumber} = route.params;
  const [data, setData] = useState<Order>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rewardLoading, setRewardLoading] = useState<boolean>(false);
  const [rewardData, setRewardData] = useState<TransactionRewards>();
  const [isError, setIsError] = useState<string | null>(null);

  useEffect(() => {
    getData({showLoader: true});
    getTransactionRewardData(orderNumber);
  }, []);

  useEffect(() => {
    const backAction = () => {
      navigation.popToTop();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const getData = async (options: {showLoader: boolean}) => {
    const {showLoader} = options;
    try {
      if (showLoader) {
        setIsLoading(true); // Show loading indicator
        setIsError(null); // Reset the error message
      }
      const contents = await getEcomOrderDetail(orderId);
      if (
        'data' in contents &&
        contents?.data?.publish_fetchEcomOrderDetails?.statusCode === 200
      ) {
        const newData = contents?.data?.publish_fetchEcomOrderDetails?.data[0];
        setData(newData);
        setIsLoading(false);
      } else {
        setIsError('Something went wrong!');
        setIsLoading(false);
      }
    } catch (err: any) {
      setIsError(err.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionRewardData = async (documentId: string) => {
    try {
      setRewardLoading(true);
      const contents = await getTransactionReward(documentId);
      if ('data' in contents && contents?.data?.users_getTransactionRewards) {
        const newData = contents?.data?.users_getTransactionRewards;
        setRewardData(newData);
        setRewardLoading(false);
      } else {
        console.log('Something went wrong!');
        setRewardLoading(false);
      }
    } catch (err: any) {
      setRewardLoading(false);
      console.log(err.message);
    } finally {
      setRewardLoading(false);
    }
  };

  const orderSummary = [
    {
      key: 'Original Subtotal (Incl. taxes)',
      value: `${getCurrencySymbol(data?.currency_code as any)}${parseFloat(
        (data?.original_order_subtotal as any) || 0,
      ).toFixed(2)}`,
    },
    {
      key: 'Total Tax',
      value: `${getCurrencySymbol(data?.currency_code as any)}${
        data?.total_tax || 0
      }`,
    },
    {key: 'Shipping and Handling Charges', value: '$0'},
    {
      key: 'Discount',
      value: `- ${getCurrencySymbol(data?.currency_code as any)}${parseFloat(
        (data?.discounted_incl_tax as any) || 0,
      ).toFixed(2)}`,
    },
    {
      key: 'Price',
      value: `${getCurrencySymbol(data?.currency_code as any)}${parseFloat(
        (data?.subtotal_gross as any) || 0,
      ).toFixed(2)}`,
    },
    {
      key: 'Points Used',
      value: `- ${getCurrencySymbol(data?.currency_code as any)}${parseFloat(
        (data?.point_conversion_amount as any) || 0,
      ).toFixed(2)}`,
      hidden: (data?.point_conversion_amount as any) ? false : true,
    },
    {
      key: 'Discount(Coupon)',
      value: `- ${getCurrencySymbol(data?.currency_code as any)}${parseFloat(
        (data?.discount_on_total_price as any) || 0,
      ).toFixed(2)}`,
      hidden: data?.discount_on_total_price ? false : true,
    },
    {
      key: 'Order Total',
      value: `${getCurrencySymbol(data?.currency_code as any)}${(
        parseFloat(data?.total_gross_amount as any) -
        parseFloat((data?.point_conversion_amount as any) || 0)
      ).toFixed(2)}`,
    },
  ];

  const calculateDeliveryDate = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    return getDateOfBirth(deliveryDate as any);
  };

  const calculateTotalPoints = (pointsList: Points[]) => {
    return pointsList?.reduce(
      (total, pointItem) => total + pointItem?.points,
      0,
    );
  };

  const totalPoints = calculateTotalPoints(rewardData?.pointsList as any);

  const displayText = totalPoints === 1 ? 'Coin' : 'Coins';

  const InfoDetails = ({title, info}: any) => {
    return (
      <View style={styles.detailContainer}>
        <Text style={[styles.detailText, {width: 128}]}>{title}</Text>
        <Text style={styles.detailText}>:</Text>
        <Text style={styles.infoText} numberOfLines={2}>
          {info}
        </Text>
      </View>
    );
  };

  const handleRetry = () => {
    getData({showLoader: true});
  };

  const handleGoToOrder = () => {
    navigation?.navigate(tabNames.orderTab);
  };

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      marginVertical: theme.cardPadding.carMargin,
      paddingBottom: theme.cardPadding.xLargeSize,
    },
    orderConfirmed: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font24,
      color: appConfigData?.secondary_text_color,
      paddingHorizontal: theme.cardMargin.left,
      marginBottom: theme.cardMargin.xSmall,
    },
    text: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: '#8F959E',
      paddingHorizontal: theme.cardMargin.left,
      marginBottom: theme.cardPadding.largeSize,
    },
    moreAction: {
      paddingTop: theme.cardPadding.largeSize,
      paddingHorizontal: theme.cardMargin.left,
      gap: theme.cardPadding.defaultPadding,
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.cardPadding.defaultPadding,
      backgroundColor: appConfigData?.primary_color,
      borderRadius: theme.border.borderRadius,
    },
    rewardContainer: {
      flexDirection: 'row',
      gap: theme.cardMargin.xSmall,
    },
    icon: {
      height: 30,
      width: 30,
    },
    pointText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
      height: 38,
    },
    comment: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.grayScale5,
      position: 'absolute',
      left: 40,
      bottom: -2,
    },
    buttonText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.primary_text_color,
    },
    orderInfoView: {
      backgroundColor: appConfigData?.background_color,
      borderRadius: theme.border.borderRadius,
      marginHorizontal: theme.cardMargin.left,
      marginVertical: theme.cardPadding.largeSize,
      paddingVertical: theme.cardPadding.defaultPadding,
      gap: theme.cardMargin.bottom,
    },
    detailContainer: {
      flexDirection: 'row',
      gap: theme.cardPadding.mediumSize,
      marginHorizontal: theme.cardMargin.left,
    },
    detailText: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: theme.colors.grayScale7,
    },
    infoText: {
      flex: 1,
      fontFamily: theme.fonts.DMSans.semiBold,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
    },
    orderSummary: {
      backgroundColor: appConfigData?.background_color,
      paddingVertical: theme.cardPadding.largeSize,
      paddingHorizontal: theme.cardMargin.left,
    },
    orderDetailText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.secondary_text_color,
    },
    orderId: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.primary_color,
      marginBottom: theme.cardPadding.mediumSize,
    },
    divider: {
      width: '100%',
      backgroundColor: '#C4C5C4',
      height: 1,
    },
    addressDetail: {
      marginVertical: theme.cardPadding.mediumSize,
      gap: theme.cardPadding.mediumSize,
      paddingHorizontal: theme.cardMargin.left,
    },
    addressText: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font12,
      color: theme.colors.grayScale5,
    },
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return isLoading ? (
    <LoadingScreen
      isLoading={isLoading}
      error={isError}
      onRetry={handleRetry}
    />
  ) : (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.orderConfirmed}>Order Confirmed!</Text>
      <Text style={styles.text}>Thank You. Your order has been Received. </Text>
      <View style={{gap: theme.cardPadding.mediumSize}}>
        {data?.lineItem.map(item => (
          <OrderedItems
            data={item}
            currencyCode={data?.currency_code}
            key={item.productId}
          />
        ))}
      </View>
      <View style={styles.moreAction}>
        <Text style={styles.orderDetailText}>Your Rewards</Text>
        {rewardLoading ? (
          <ActivityIndicator
            color={'grey'}
            size={'small'}
            style={styles.loading}
          />
        ) : (
          <View style={styles.rewardContainer}>
            <Image source={icons.loyaltyPointIcon} style={styles.icon} />
            {rewardData?.pointsList?.length === 0 ? (
              <Text style={styles.pointText}>
                You didn't earn Coins with this purchase.
              </Text>
            ) : (
              <>
                <Text style={styles.pointText}>
                  {totalPoints} {displayText} earned with this Purchase.
                </Text>
                <Text style={styles.comment}>
                  It will be uploaded after delivery.
                </Text>
              </>
            )}
          </View>
        )}
      </View>
      <View style={styles.moreAction}>
        <Text style={styles.orderDetailText}>More Actions</Text>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.button}
          onPress={handleGoToOrder}>
          <Text style={styles.buttonText}>Go to your Orders</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.orderInfoView}>
        <InfoDetails title={'Order Number'} info={`#${data?.orderNumber}`} />
        <InfoDetails
          title={'Order Date'}
          info={getDateOfBirth(data?.createdAt as any)}
        />
        <InfoDetails title={'Delivery Date'} info={calculateDeliveryDate()} />
        <InfoDetails
          title={'Delivery Address'}
          info={`${
            data?.shippingAddress.city && data?.shippingAddress.city + ', '
          }${data?.shippingAddress.state}, ${data?.shippingAddress.country}`}
        />
        <InfoDetails title={'Mode of Payment'} info={'Cash on Delivery'} />
      </View>
      <View style={{backgroundColor: appConfigData?.background_color}}>
        <View style={styles.orderSummary}>
          <Text style={styles.orderDetailText}>Order Details</Text>
          <Text style={styles.orderId}>Order ID : #{data?.orderNumber}</Text>
          <OrderSummary data={orderSummary} />
        </View>
        <View style={styles.divider} />
        <View style={styles.addressDetail}>
          <Text style={styles.addressText}>Shipping Address</Text>
          <AddressDetails address={data?.shippingAddress} />
          <View style={styles.divider} />
          <Text style={styles.addressText}>Billing Address</Text>
          <AddressDetails
            address={
              data?.billing_address
                ? data.billing_address
                : data?.shippingAddress
            }
          />
        </View>
        <View style={styles.divider} />
        <FeaturedCarousel
          headingText={'You Might be also interested in'}
          productId={data?.lineItem[0]?.productId}
          productType={'crosssellproducts'}
        />
        <FeaturedCarousel
          headingText={'You may Also like'}
          productId={data?.lineItem[0]?.productId}
          productType={'upsellproducts'}
        />
        <FeaturedCarousel
          headingText={'Recently Viewed'}
          productId={data?.lineItem[0]?.productId}
          productType={'recentlyviewed'}
        />
      </View>
    </ScrollView>
  );
};

export default OrderConfirmedScreen;
