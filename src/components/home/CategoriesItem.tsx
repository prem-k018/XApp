/* eslint-disable react/self-closing-comp */
/* eslint-disable react/react-in-jsx-scope */
import {icons} from '@app/assets/icons';
import {theme} from '@app/constants';
import {addTocart, button, cartID, ecomProduct} from '@app/constants/constants';
import ScreenNames from '@app/constants/screenNames';
import {useHandleRetailCardClick} from '@app/deeplinks/retailCardDeeplinks';
import {EcomProduct} from '@app/model/product/personalizedContent';
import {Product} from '@app/model/product/productList';
import addProductToCart from '@app/services/productPurchase/cartManagement';
import {addEventForTracking} from '@app/services/tracking/rpiServices';
import {useAppContext} from '@app/store/appContext';
import {getCurrencySymbol} from '@app/utils/HelperFunction';
import screensUtils from '@app/utils/screensUtils';
import StorageService from '@app/utils/storageService';
import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';

export type Props = {
  data: Product | EcomProduct;
  index: number;
  mainData?: any;
};

const CategoriesItem: React.FC<Props> = ({data, index, mainData}) => {
  const {appConfigData} = useAppContext();
  const screenWidth = screensUtils.screenWidth;
  const totalWidth =
    screenWidth -
    (theme.cardMargin.left + theme.cardMargin.right + theme.cardMargin.left);
  const containerWidth = totalWidth / 2;
  const cardClickHandle = useHandleRetailCardClick(data);
  const {addToCart, isInCart} = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    StorageService.getData(cartID);
  }, []);

  const handleAddToCart = async () => {
    setIsLoading(true);
    addEventForTracking({
      ContentType: ScreenNames.cartHomeScreen,
      screenType: button,
      button_name: 'add_to_cart_button',
    });

    try {
      let cartId = await StorageService.getData(cartID);
      if (!cartId) {
        const result = await addProductToCart(true);
        cartId = result?.data?.publish_addProductToCart?.cartId;
        if (cartId) await StorageService.storeData(cartID, cartId);
      }
      if (cartId) addProductInCart(cartId);
    } catch {
      setIsLoading(false);
    }
  };

  const addProductInCart = async (cartId: any) => {
    try {
      const result = await addProductToCart(
        undefined,
        cartId,
        data.id,
        Number(data.ecomx_variant_id),
        1,
      );
      const lineItemId = result?.data?.publish_addProductToCart?.line_item_id;

      if (lineItemId) {
        addEventForTracking({
          ...data,
          screenType: addTocart,
          ContentType: ecomProduct,
        });
        addToCart({...data, line_item_id: lineItemId});
      }
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    } finally {
      setIsLoading;
    }
  };

  let imageObj = '';

  if (data.attr_images?.length > 0) {
    imageObj = data.attr_images[0];
  }

  const styles = StyleSheet.create({
    content: {
      width: containerWidth,
      paddingVertical: theme.cardPadding.defaultPadding,
      paddingHorizontal: 10,
      marginLeft: theme.cardMargin.left,
      borderWidth: theme.border.borderWidth,
      borderColor: '#E5E5E5',
      borderRadius: theme.border.borderRadius,
      backgroundColor: appConfigData?.background_color,
      gap: theme.cardPadding.defaultPadding,
      overflow: 'hidden',
    },
    image: {
      height: 130,
      width: '100%',
      alignSelf: 'center',
    },
    title: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
      paddingBottom: 10,
    },
    costView: {
      flexDirection: 'row',
    },
    cost: {
      fontFamily: theme.fonts.DMSans.semiBold,
      fontSize: theme.fontSize.font10,
      color: appConfigData?.secondary_text_color,
      textDecorationLine: 'line-through',
      alignSelf: 'center',
      marginRight: 5,
    },
    discountCost: {
      fontFamily: theme.fonts.DMSans.bold,
      fontSize: theme.fontSize.font12,
      color: theme.primaryColor,
    },
    productDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    ratingView: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: 2,
    },
    ratingText: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font10,
      color: appConfigData?.secondary_text_color,
    },
    buttonView: {
      paddingVertical: 10,
      paddingHorizontal: theme.cardMargin.left,
      backgroundColor: appConfigData?.primary_color,
      borderRadius: theme.border.borderRadius,
    },
    buttonText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.primary_text_color,
      alignSelf: 'center',
    },
    icon: {
      width: 20,
      height: 20,
      tintColor: appConfigData?.background_color,
    },
    buttonActive: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: theme.border.borderRadius,
      backgroundColor: theme.primaryColor,
    },
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={cardClickHandle}
      style={[
        styles.content,
        mainData &&
          index === mainData?.length - 1 && {
            marginRight: theme.cardPadding.defaultPadding,
          },
      ]}>
      <FastImage
        style={styles.image}
        source={{
          uri: imageObj,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />

      <View>
        <Text numberOfLines={1} style={styles.title}>
          {data.ecomx_name}
        </Text>
        <View style={styles.productDetails}>
          <View style={styles.costView}>
            {data.ecomx_list_price && (
              <Text style={styles.cost}>
                {getCurrencySymbol(data.ecomx_currency_code)}
                {data.ecomx_list_price}
              </Text>
            )}
            <Text style={styles.discountCost}>
              {getCurrencySymbol(data.ecomx_currency_code)}
              {data.ecomx_sale_price}
            </Text>
          </View>
          <View style={styles.ratingView}>
            <Image source={icons.ratingStar} />
            <Text style={styles.ratingText}>4.6</Text>
          </View>
        </View>
      </View>
      {!isInCart[data.id] ? (
        <TouchableOpacity
          onPress={handleAddToCart}
          activeOpacity={1}
          style={styles.buttonView}>
          {isLoading ? (
            <ActivityIndicator color={theme.colors.primaryWhite} />
          ) : (
            <Text style={styles.buttonText}>Add to Cart</Text>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity activeOpacity={1} style={styles.buttonActive}>
          <Text style={styles.buttonText}>Added</Text>
          <Image source={icons.shoppingCartIcon} style={styles.icon} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default CategoriesItem;
