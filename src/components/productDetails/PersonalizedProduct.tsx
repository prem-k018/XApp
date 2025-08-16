import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';
import {icons} from '@app/assets/icons';
import {getCurrencySymbol} from '@app/utils/HelperFunction';
import {EcomProduct} from '@app/model/product/personalizedContent';
import FastImage from 'react-native-fast-image';
import addProductToCart from '@app/services/productPurchase/cartManagement';
import StorageService from '@app/utils/storageService';
import {cartID} from '@app/constants/constants';

export type Props = {
  data: any;
  oftenPurchasedData: EcomProduct[];
};

const PersonalizedProduct: React.FC<Props> = ({data, oftenPurchasedData}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {addToCart, appConfigData} = useAppContext();
  const [selectedProducts, setSelectedProducts] = useState<any>(
    oftenPurchasedData, // Store the whole product object instead of just IDs
  );

  const defaultImage =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIoAAACKCAMAAABCWSJWAAAAUVBMVEXd3d3g4ODNzc3j4+M7Ozupqal7e3vR0dGLi4tdXV3o6Ohvb2/W1tZsbGycnJxKSkqSkpIAAACxsbF1dXU2NjbHx8dRUVEgICARERG+vr64uLiybrQAAAAAzUlEQVR4nO3WSRKCMBBA0Qw2kTYDGnG6/0GNLpAbtIv/FlSxyq8UaeIcAAAAAAAAAAAAAAAw5TfWIamcvnp5ReOUcF3qcGxLFdsWHw45DqG5OmfrlOS882tLms7J8nv5pGivcW05+tQvhi3flHnRtVURuYl1yiQx9FLKqVmnbMv72Trl90LKPiV//EWKyvn+mNTbp4zDPPblMqdonhLlOeZtkGy+K1lVx19oPNU45Xr8sR1xuU87L9P7U9yzvskBAAAAAAAAAAAAAAD8tzdQYAdOgzoIUQAAAABJRU5ErkJggg==';

  const initialAmount =
    Number(data.ecomx_sale_price) +
    oftenPurchasedData.reduce((sum, p) => {
      return sum + Number(p.ecomx_sale_price);
    }, 0);

  const [totalAmount, setTotalAmount] = useState<number>(initialAmount);

  const handleToggle = (product: any) => {
    let updatedSelectedProducts = [...selectedProducts];
    const ProductPrice = Number(product.ecomx_sale_price);

    const productExists = selectedProducts.some(
      (p: any) => p.id === product.id,
    );

    if (productExists) {
      updatedSelectedProducts = updatedSelectedProducts.filter(
        (p: any) => p.id !== product.id,
      );
      setTotalAmount((prevAmount: any) => prevAmount - ProductPrice);
    } else {
      updatedSelectedProducts.push(product);
      setTotalAmount((prevAmount: any) => prevAmount + ProductPrice);
    }

    setSelectedProducts(updatedSelectedProducts);
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    const storedCartID = await StorageService.getData(cartID);

    if (storedCartID) {
      await Promise.all(
        selectedProducts.map(async (product: any) => {
          const selectedProduct = oftenPurchasedData.find(
              p => p.id === product.id,
            );
            if (selectedProduct) {
              await addProductInCart(product, storedCartID);
              console.log("Selected Products ===> ", selectedProducts.length)
          }
        }),
      );
    } else {
      try {
        const result = await addProductToCart(true);
        if ('data' in result && result.data.publish_addProductToCart.cartId) {
          const cartId = result.data.publish_addProductToCart.cartId;
          await StorageService.storeData(cartID, cartId);

          // Add each selected product to the cart
          await Promise.all(
            selectedProducts.map(async (product: any) => {
              const selectedProduct = oftenPurchasedData.find(
                p => p.id === product.id,
              );
              if (selectedProduct) {
                await addProductInCart(product, cartId);
                console.log('2 and selectedProduct ===> ', product.id);
              }
            }),
          );
        }
      } catch (err: any) {
        setIsLoading(false);
      }
    }
    setIsLoading(false);
  };

  async function addProductInCart(product: any, cartId: string) {
    try {
      const result = await addProductToCart(
        undefined,
        cartId,
        product.id,
        product.ecomx_variant_id,
        1,
      );

      if (
        'data' in result &&
        result.data.publish_addProductToCart.line_item_id
      ) {
        const newData = {
          ...product,
          line_item_id: result.data.publish_addProductToCart.line_item_id,
        };
        addToCart(newData);
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
    }
  }

  const PersonalizedItem = ({item, index}: {item: any; index: number}) => {
    let imageObj = '';

    if (item.attr_images?.length > 0) {
      imageObj = item.attr_images[0];
    }

    return (
      <View key={index} style={styles.product}>
        <TouchableOpacity activeOpacity={1} onPress={() => handleToggle(item)}>
          {selectedProducts.some(
            (selectedProduct: any) => selectedProduct.id === item.id,
          ) ? (
            <View style={styles.checkBox}>
              <Image source={icons.checkMark} />
            </View>
          ) : (
            <View style={styles.emptyBox} />
          )}
        </TouchableOpacity>
        <View style={styles.imageView}>
          <FastImage
            style={styles.image}
            source={{
              uri: imageObj,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text} numberOfLines={2}>
            {item.ecomx_name}
          </Text>
          <Text style={styles.cost}>{`${getCurrencySymbol(
            item?.ecomx_currency_code,
          )} ${item?.ecomx_sale_price}`}</Text>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      paddingVertical: theme.cardPadding.defaultPadding,
      paddingHorizontal: theme.cardMargin.left,
      backgroundColor: appConfigData?.background_color,
      gap: theme.cardPadding.largeSize,
    },
    text: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.secondary_text_color,
    },
    product: {
      flexDirection: 'row',
      gap: theme.cardPadding.defaultPadding,
      alignItems: 'center',
    },
    imageView: {
      height: 75,
      width: 75,
      backgroundColor: '#F3F3F3',
      borderRadius: 3,
    },
    image: {
      borderRadius: 3,
      height: '100%',
      width: '100%',
    },
    cost: {
      fontFamily: theme.fonts.Inter.regular,
      fontSize: theme.fontSize.font14,
      color: '#6E7191',
    },
    textContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
    },
    divider: {
      borderBottomWidth: theme.border.borderWidth,
      borderBottomColor: '#D9DBE9',
    },
    totalProduct: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    totalCost: {
      fontFamily: theme.fonts.DMSans.semiBold,
      fontSize: theme.fontSize.font24,
      color: appConfigData?.secondary_text_color,
    },
    buttonView: {
      paddingVertical: theme.cardPadding.defaultPadding,
      paddingHorizontal: theme.cardMargin.left,
      height: 50,
      backgroundColor: appConfigData?.primary_color,
      borderRadius: theme.border.borderRadius,
    },
    buttonText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.primary_text_color,
      alignSelf: 'center',
    },
    emptyBox: {
      height: theme.cardPadding.mediumSize,
      width: theme.cardPadding.mediumSize,
      borderWidth: theme.border.borderWidth,
      borderRadius: 2,
      borderColor: appConfigData?.secondary_text_color,
    },
    checkBox: {
      height: theme.cardPadding.mediumSize,
      width: theme.cardPadding.mediumSize,
      borderRadius: 2,
      backgroundColor: appConfigData?.primary_color,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Often Purchased Together</Text>
      <View style={[styles.product, {alignItems: 'center'}]}>
        <View style={styles.imageView}>
          <Image
            source={{uri: data?.attr_images?.[0] ?? defaultImage}}
            style={styles.image}
          />
        </View>
        <Text style={[styles.text, {flex: 1}]} numberOfLines={2}>
          {data?.ecomx_name}
        </Text>
      </View>
      {oftenPurchasedData.map((item: any, index: number) => (
        <PersonalizedItem item={item} key={index} index={index} />
      ))}
      <View style={styles.divider} />
      <View style={styles.totalProduct}>
        <View>
          <Text style={styles.cost}>Total Price</Text>
          <Text style={styles.totalCost}>{`${getCurrencySymbol(
            data?.ecomx_currency_code,
          )} ${totalAmount}`}</Text>
        </View>
        <TouchableOpacity
          onPress={handleAddToCart}
          activeOpacity={1}
          style={styles.buttonView}>
          <Text style={styles.buttonText}>
            Add {selectedProducts.length + 1} Items to Cart
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PersonalizedProduct;
