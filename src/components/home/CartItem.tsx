/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {icons} from '@app/assets/icons';
import {theme} from '@app/constants';
import {cartID} from '@app/constants/constants';
import {useHandleRetailCardClick} from '@app/deeplinks/retailCardDeeplinks';
import {
  removeLineItemFromCart,
  updateLineItem,
} from '@app/services/productPurchase/cartManagement';
import {useAppContext} from '@app/store/appContext';
import {getCurrencySymbol} from '@app/utils/HelperFunction';
import screensUtils from '@app/utils/screensUtils';
import StorageService from '@app/utils/storageService';
import {useState} from 'react';
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
  data: any;
  index: number;
  refreshCart: any;
  setLoadingState: any;
};

const CartItems: React.FC<Props> = ({data, refreshCart, setLoadingState}) => {
  const cardClickHandle = useHandleRetailCardClick(data);
  const {appConfigData, removeFromCart} = useAppContext();
  const screenWidth = screensUtils.screenWidth;
  const containerWidth =
    screenWidth - (theme.cardMargin.left + theme.cardMargin.right);
  const imageWidth = (containerWidth - (10 + 10 + 16)) / 2;
  const [isLoading, setIsLoading] = useState(false);
  const [prodQuantity, setProdQuantity] = useState<number>(data.ecomx_quantity);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);

  let itemInStock = parseInt(data.ecomx_stock_quantity, 10);

  let imageObj = '';

  if (data.attr_images?.length > 0) {
    imageObj = data.attr_images[0];
  }

  const increment = () => {
    if (!isUpdatingQuantity && prodQuantity < itemInStock) {
      const newQuantity = prodQuantity + 1;
      setProdQuantity(newQuantity);
      handleUpdateLineItem(newQuantity);
    }
  };

  const decrement = () => {
    if (!isUpdatingQuantity && prodQuantity < itemInStock) {
      const newQuantity = prodQuantity - 1;
      setProdQuantity(newQuantity);
      handleUpdateLineItem(newQuantity);
    }
  };

  const handleRemoveFromCart = async () => {
    try {
      setIsLoading(true);

      const storedCartID = await StorageService.getData(cartID);
      const line_item_id = data.id;

      const result = await removeLineItemFromCart(
        storedCartID ?? '',
        line_item_id,
      );

      if ('data' in result && result?.data?.publish_removeLineItem?.cart_id) {
        console.log(result?.data?.publish_removeLineItem?.statusCode);
        removeFromCart(data.product_id);
        refreshCart();
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
    }
  };

  const handleUpdateLineItem = async (quantity: number) => {
    try {
      setIsUpdatingQuantity(true);
      setLoadingState(true);
      const storedCartID = await StorageService.getData(cartID);
      const line_item_id = data.id;

      const result = await updateLineItem(
        storedCartID ?? '',
        line_item_id,
        quantity,
      );

      if (
        'data' in result &&
        result?.data?.publish_updateLineItem?.statusCode
      ) {
        console.log(result?.data?.publish_updateLineItem?.statusCode);
        refreshCart();
      }
    } catch (err: any) {
      console.log(err.message);
    } finally {
      setIsUpdatingQuantity(false);
      setLoadingState(false);
    }
  };

  const styles = StyleSheet.create({
    content: {
      width: containerWidth,
      paddingVertical: theme.cardPadding.defaultPadding,
      paddingHorizontal: 10,
      marginLeft: theme.cardMargin.left,
      borderRadius: theme.border.borderRadius,
      backgroundColor: appConfigData?.background_color,
      gap: theme.cardPadding.defaultPadding,
      flexDirection: 'row',
    },
    image: {
      height: imageWidth,
      width: '45%',
    },
    rightSide: {
      width: imageWidth,
      height: 'auto',
      gap: 4,
      justifyContent: 'center',
    },
    title: {
      fontFamily: theme.fonts.DMSans.bold,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
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
      paddingTop: 10,
    },
    ratingView: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: 3,
    },
    ratingText: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font10,
      color: appConfigData?.secondary_text_color,
    },
    starIcon: {
      alignSelf: 'center',
      height: 12,
      width: 12,
    },
    countView: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderWidth: theme.border.borderWidth,
      borderRadius: theme.border.borderRadius,
      borderColor: '#EDEDED',
      gap: theme.cardPadding.defaultPadding,
    },
    deleteIcon: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderWidth: theme.border.borderWidth,
      borderRadius: theme.border.borderRadius,
      borderColor: '#EDEDED',
    },
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={cardClickHandle}
      style={styles.content}>
      {imageObj && (
        <FastImage
          style={styles.image}
          source={{
            uri: imageObj,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      )}

      <View style={styles.rightSide}>
        <Text numberOfLines={2} style={styles.title}>
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
        <View style={styles.productDetails}>
          <View style={styles.countView}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={decrement}
              disabled={isUpdatingQuantity || prodQuantity === 1}
              hitSlop={{bottom: 10, left: 10, top: 10, right: 10}}>
              <Text
                style={[
                  styles.title,
                  (isUpdatingQuantity || prodQuantity === 1) && {
                    color: '#C4C5C4',
                  },
                ]}>
                -
              </Text>
            </TouchableOpacity>
            <Text
              style={[
                styles.title,
                {
                  color: appConfigData?.primary_color,
                  width: 32,
                  textAlign: 'center',
                },
              ]}>
              {prodQuantity}
            </Text>
            <TouchableOpacity
              activeOpacity={1}
              disabled={isUpdatingQuantity || prodQuantity === itemInStock}
              onPress={increment}
              hitSlop={{bottom: 10, left: 10, top: 10, right: 10}}>
              <Text
                style={[
                  styles.title,
                  (isUpdatingQuantity || prodQuantity === itemInStock) && {
                    color: '#C4C5C4',
                  },
                ]}>
                +
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleRemoveFromCart}
            style={styles.deleteIcon}>
            {isLoading ? (
              <ActivityIndicator color={theme.primaryColor} />
            ) : (
              <Image source={icons.deleteIcon} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CartItems;
