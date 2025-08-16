import {StyleSheet, ScrollView} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {icons} from '@app/assets/icons';
import LoadingScreen from '../loadingScreen/loadingScreen';
import {sessionTimeout} from '@app/constants/errorCodes';
import providePoints from '@app/services/openLoyalty/loyaltyPoint';
import DefaultHeader from '@app/components/ui-components/defaultHeader';
import ImageCarousel from '@app/components/productDetails/ImageCarousel';
import ProductDescription from '@app/components/productDetails/ProductDescription';
import ProductVendor from '@app/components/productDetails/ProductVendor';
import ProductReview from '@app/components/productDetails/ProductReview';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ScreenNames from '@app/constants/screenNames';
import getProductDetailScreenData from '@app/services/product/productDetails';
import {Product} from '@app/model/product/productDetail';
import FeaturedCarousel from '@app/components/home/FeaturedCarousel';
import NoDataScreen from '../loadingScreen/NoDataScreen';
import BackAndContinueButton from '@app/components/productPurchase/BackAndContinueButtons';
import {useAppContext} from '@app/store/appContext';
import addProductToCart from '@app/services/productPurchase/cartManagement';
import StorageService from '@app/utils/storageService';
import {cartID} from '@app/constants/constants';

const ProductDetailsScreen: React.FC = ({route}: any) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [response, setResponse] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const {isInCart, addToCart} = useAppContext();
  const [leftButtonLoading, setLeftButtonLoading] = useState<boolean>(false);
  const [rightButtonLoading, setRightButtonLoading] = useState<boolean>(false);

  const {data} = route.params;

  useEffect(() => {
    loadData({showLoader: true});
  }, []);

  async function loadData(options: {showLoader: boolean}) {
    const {showLoader} = options;
    setIsLoading(true);

    try {
      if (showLoader) {
        setIsError(null);
        setIsLoading(true);
      }
      const contents = await getProductDetailScreenData(data.id);
      if (
        'data' in contents &&
        contents?.data?.publish_fetchEcomProductDetails
      ) {
        setResponse(contents?.data?.publish_fetchEcomProductDetails);
        await providePoints(data.Id ?? '');
        setIsLoading(false);
      } else {
        setIsError('Something went wrong!!!!'); // Set the error message
        setIsLoading(true);
      }
    } catch (err: any) {
      setIsError('Something went wrong!');
      console.log(err.message);
      if (err.message !== sessionTimeout) {
        setIsError('Something went wrong!!!!');
      }
      setIsLoading(true);
    }
  }

  const handleRetry = () => {
    loadData({showLoader: true});
  };

  const handleLeftButton = async () => {
    if (isInCart[data.id]) {
      navigation?.navigate(ScreenNames.cartHomeScreen);
    } else {
      setLeftButtonLoading(true);
      const storedCartID = await StorageService.getData(cartID);

      if (storedCartID) {
        addProductInCart(data, storedCartID);
      } else {
        try {
          const result = await addProductToCart(true);
          if ('data' in result && result.data.publish_addProductToCart.cartId) {
            const cartId = result.data.publish_addProductToCart.cartId;
            await StorageService.storeData(cartID, cartId);
            addProductInCart(data, cartId);
          }
        } catch (err: any) {
          console.log(err.message);
        }
      }

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
              ...data,
              line_item_id: result.data.publish_addProductToCart.line_item_id,
            };
            addToCart(newData);
            setLeftButtonLoading(false);
          }
        } catch (err: any) {
          console.log(err.message);
          setLeftButtonLoading(false);
        }
      }
    }
  };

  const handleRightButton = async () => {
    setRightButtonLoading(true);
    const storedCartID = await StorageService.getData(cartID);

    if (storedCartID) {
      addProductInCart(data, storedCartID);
    } else {
      try {
        const result = await addProductToCart(true);
        if ('data' in result && result.data.publish_addProductToCart.cartId) {
          const cartId = result.data.publish_addProductToCart.cartId;
          await StorageService.storeData(cartID, cartId);
          addProductInCart(data, cartId);
        }
      } catch (err: any) {
        console.log(err.message);
      }
    }

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
            ...data,
            line_item_id: result.data.publish_addProductToCart.line_item_id,
          };
          addToCart(newData);
          navigation.navigate(ScreenNames.cartHomeScreen);
          setRightButtonLoading(false);
        }
      } catch (err: any) {
        console.log(err.message);
        setRightButtonLoading(false);
      }
    }
  };

  const scrollViewRef = useRef<ScrollView>(null);

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      marginTop: 1,
      paddingBottom: 20,
    },
  });

  return isLoading ? (
    <>
      <DefaultHeader
        header="Product Detail"
        icon1={icons.shoppingCartIcon}
        showBadged={true}
        onPressIcon1={() => navigation?.navigate(ScreenNames.cartHomeScreen)}
      />
      <LoadingScreen
        isLoading={isLoading}
        error={isError}
        onRetry={handleRetry}
      />
    </>
  ) : (
    <>
      <DefaultHeader
        header="Product Detail"
        icon1={icons.shoppingCartIcon}
        showBadged={true}
        onPressIcon1={() => navigation?.navigate(ScreenNames.cartHomeScreen)}
      />
      {!response || Object.keys(response).length === 0 ? (
        <NoDataScreen />
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.container}
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            bounces={false}>
            <ImageCarousel
              responseData={response ?? {}}
              data={data}
              productImage={response?.attr_images ?? []}
              productTrailer={response?.ecomx_attributes_video_url ?? ''}
            />
            <FeaturedCarousel
              headingText={'Often Purchased Together'}
              productId={data.id}
              productType={'crosssellproducts'}
            />
            <FeaturedCarousel
              headingText={'Similar Products'}
              productId={data.id}
              productType={'upsellproducts'}
            />
            <FeaturedCarousel
              headingText={'Related Products'}
              productId={data.id}
              productType={'relatedproducts'}
            />
            <ProductVendor name={'West Summer'} datePosted={'Official Store'} />
            {response?.ecomx_desc?.length !== 0 && (
              <ProductDescription description={response?.ecomx_desc ?? ''} />
            )}
            <ProductReview />
            <FeaturedCarousel
              headingText={'Recently Viewed'}
              productId={data.id}
              productType={'recentlyviewed'}
            />
          </ScrollView>
          <BackAndContinueButton
            leftButtonText={isInCart[data.id] ? 'Go to Cart' : 'Add to Cart'}
            rightButtonText="Order Now"
            isButtonDisabled={true}
            handleLeftButton={handleLeftButton}
            handleRightButton={handleRightButton}
            leftButtonLoading={leftButtonLoading}
            rightButtonLoading={rightButtonLoading}
          />
        </>
      )}
    </>
  );
};

export default ProductDetailsScreen;
