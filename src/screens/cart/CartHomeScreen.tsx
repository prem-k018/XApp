/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {theme} from '@app/constants';
import {useAppContext} from '@app/store/appContext';
import {icons} from '@app/assets/icons';
import DefaultHeader from '@app/components/ui-components/defaultHeader';
import CartItems from '@app/components/home/CartItem';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ScreenNames from '@app/constants/screenNames';
import {getCurrencySymbol} from '@app/utils/HelperFunction';
import LoadingScreen from '../loadingScreen/loadingScreen';
import {sessionTimeout} from '@app/constants/errorCodes';
import {getCartItemList} from '@app/services/productPurchase/cartManagement';
import StorageService from '@app/utils/storageService';
import {
  button,
  cartCheckOut,
  cartID,
  ecomProduct,
} from '@app/constants/constants';
import {addEventForTracking} from '@app/services/tracking/rpiServices';
import {CartData} from '@app/model/productPurchase/cartManagement';

const CartHomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {appConfigData} = useAppContext();
  let {cartItems, setCartItems} = useAppContext();
  const [cartData, setCartData] = useState<CartData>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);

  let currencyCode = '';
  if (cartItems.length > 0) {
    currencyCode = getCurrencySymbol(cartItems[0].ecomx_currency_code);
  }

  useEffect(() => {
    getData({showLoader: true});
  }, []);

  async function getData(options: {showLoader: boolean}) {
    const {showLoader} = options;

    const storedCartID = await StorageService.getData(cartID);

    if (storedCartID) {
      try {
        if (showLoader) {
          setIsLoading(true);
          setIsError(null);
        }

        // Call the fetchGraphQLData function with input parameters
        const contents = await getCartItemList(storedCartID ?? '');

        if (
          'data' in contents &&
          contents?.data?.publish_getCartItems?.data?.line_item
        ) {
          const newData = contents?.data?.publish_getCartItems?.data;
          setCartData(newData);
          setCartItems(newData.line_item);
          setIsLoading(false);
        } else {
          setIsError('Something went wrong!!!!');
          setIsLoading(true);
        }
      } catch (err: any) {
        if (err.message !== sessionTimeout) {
          setIsError('Something went wrong!!!!');
        }
        setIsLoading(true);
      }
    }
  }

  const totalQuantity = cartData?.line_item?.reduce((total: any, item: any) => {
    return total + (item.ecomx_quantity || 0);
  }, 0);

  const refreshCart = () => {
    getData({showLoader: false});
  };

  const RenderDisclaimer = ({number, text}: any) => {
    return (
      <View style={styles.item}>
        <Text style={[styles.disclaimerText, {alignSelf: 'flex-start'}]}>
          {number}.
        </Text>
        <Text style={styles.disclaimerText}> {text}</Text>
      </View>
    );
  };

  const declaimer = [
    'A minimum of 1 piece should be ordered at one time for each product.',
    'All the orders will be delivered to the saved shop addresses.',
    'All payments will be cash on delivery.',
  ];

  const handleCartChekout = async () => {
    const storedCartID = await StorageService.getData(cartID);
    const button_Data = {
      ContentType: ecomProduct,
      screenType: button,
      button_name: 'checkout_button',
    };
    addEventForTracking(button_Data);
    const productsData = cartData?.line_item?.map(item => {
      return {
        product_id: item.id,
        product_name: item.ecomx_name,
        product_quantity: item.ecomx_quantity,
        product_price_per_unit: parseFloat(item.ecomx_sale_price),
        total_value: item.ecomx_quantity * parseFloat(item.ecomx_sale_price),
        product_category: item.attr_categories,
      };
    });

    const eventData = {
      ContentType: ecomProduct,
      cart_total_Items: totalQuantity,
      screenType: cartCheckOut,
      cart_total_amount: cartData?.total_price,
      cart_id: storedCartID,
      currency: cartData?.currency_code,
      products: productsData,
    };
    addEventForTracking(eventData);
    navigation.navigate(ScreenNames.addressScreen, {
      data: cartData,
    });
  };

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      marginTop: 1,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: '#838589',
      textAlign: 'center',
    },
    flatListView: {
      paddingTop: theme.cardMargin.top,
      gap: theme.cardMargin.bottom,
      flexGrow: 1,
    },
    searchText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.secondary_text_color,
      alignSelf: 'center',
    },
    disclaimerView: {
      marginLeft: theme.cardMargin.left,
      marginRight: theme.cardMargin.right,
      paddingBottom: 28,
    },
    disclaimerText: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: '#838589',
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    bottomView: {
      paddingVertical: 26,
      backgroundColor: appConfigData?.background_color,
    },
    total: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: '#838589',
      paddingHorizontal: theme.cardMargin.left,
    },
    productDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 4,
      paddingBottom: 22,
      paddingHorizontal: theme.cardMargin.left,
    },
    quantity: {
      fontFamily: theme.fonts.DMSans.bold,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
    },
    price: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font20,
      color: appConfigData?.secondary_text_color,
    },
    buttonView: {
      paddingVertical: theme.cardPadding.defaultPadding,
      backgroundColor: isUpdateLoading
        ? '#C4C5C4'
        : appConfigData?.primary_color,
      borderRadius: theme.border.borderRadius,
      marginHorizontal: theme.cardMargin.left,
    },
    buttonText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.primary_text_color,
      alignSelf: 'center',
    },
  });

  const handleRetry = () => {
    getData({showLoader: true});
  };

  const FooterComponent = () => {
    return (
      <View style={styles.disclaimerView}>
        <Text style={styles.disclaimerText}>Disclaimer:</Text>
        {declaimer.map((item, index) => (
          <RenderDisclaimer key={index} number={index + 1} text={item} />
        ))}
      </View>
    );
  };

  return isLoading ? (
    <>
      <DefaultHeader header="My Cart" />
      <LoadingScreen
        isLoading={isLoading}
        error={isError}
        onRetry={handleRetry}
      />
    </>
  ) : (
    <>
      <DefaultHeader header="My Cart" />
      {cartItems.length === 0 ? (
        <View style={styles.content}>
          <Image source={icons.searchScreenIcon} />
          <Text style={[styles.searchText, {marginTop: 30, marginBottom: 20}]}>
            There are no products in your cart
          </Text>
          <Text
            style={[styles.text, {paddingHorizontal: theme.cardMargin.left}]}>
            Please continuing shopping to add item in cart
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            contentContainerStyle={styles.flatListView}
            data={cartItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}: any) => (
              <CartItems
                data={item}
                index={index}
                refreshCart={refreshCart}
                setLoadingState={setIsUpdateLoading}
              />
            )}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<FooterComponent />}
            ListFooterComponentStyle={{
              flex: 1,
              justifyContent: 'space-between',
            }}
          />
          <View style={styles.bottomView}>
            <Text style={styles.total}>Total</Text>
            <View style={styles.productDetails}>
              <Text style={styles.quantity}>{totalQuantity} Items</Text>
              <Text style={styles.price}>
                {currencyCode}
                {cartData?.total_price}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={1}
              disabled={isUpdateLoading}
              onPress={handleCartChekout}
              style={styles.buttonView}>
              <Text style={styles.buttonText}>Proceed to Shop Address</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
};

export default CartHomeScreen;
