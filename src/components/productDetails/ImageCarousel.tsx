import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useAppContext} from '@app/store/appContext';
import screensUtils from '@app/utils/screensUtils';
import {theme} from '@app/constants';
import {icons} from '@app/assets/icons';
import FastImage from 'react-native-fast-image';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import ScreenNames from '@app/constants/screenNames';
import {getCurrencySymbol} from '@app/utils/HelperFunction';
import {getLoyaltyPoints} from '@app/services/productPurchase/cartManagement';
import {Product} from '@app/model/product/productDetail';
import LinearGradient from 'react-native-linear-gradient';

export type Props = {
  responseData: Product;
  data: any;
  productImage: string[];
  productTrailer: string;
};

const ImageCarousel: React.FC<Props> = ({
  responseData,
  data,
  productImage,
  productTrailer,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const flatListRef = useRef<FlatList | null>(null);
  const {appConfigData} = useAppContext();
  const {addToCart} = useAppContext();
  const [loyaltyPoints, setLoyaltyPoints] = useState<string>('');

  const productData = [...productImage, productTrailer].filter((item: string) =>
    Boolean(item),
  );

  // Get the screen width and calculate the container's width and height
  const screenWidth = screensUtils.screenWidth;
  const containerWidth =
    screenWidth - (theme.cardMargin.left + theme.cardMargin.right); // 16 pixels on each side

  useEffect(() => {
    fetchLoyaltyPoints();
  }, []);

  async function fetchLoyaltyPoints() {
    try {
      const response = await getLoyaltyPoints(responseData.ecomx_sale_price);
      setLoyaltyPoints(response.data.result.toString());
    } catch {}
  }

  const handleScroll = (event: any) => {
    const contentOffSetX = event?.nativeEvent?.contentOffset?.x || 0;
    const page = Math.round(contentOffSetX / screenWidth);
    setCurrentPage(page);
  };

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({index, animated: true});
  };

  const decodeHTMLEntities = (text: string) => {
    return text?.replace(/&#(\d+);/g, (match: any, dec: any) => {
      return String.fromCharCode(dec);
    });
  };

  const formattedTitle = decodeHTMLEntities(
    responseData?.ecomx_attributes_product_360_title as any,
  );

  const styles = StyleSheet.create({
    container: {
      paddingVertical: theme.cardPadding.carMargin,
      backgroundColor: appConfigData?.background_color,
    },
    flatListContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.cardMargin.left,
    },
    content: {
      marginRight: theme.cardMargin.left,
      height: '100%',
      backgroundColor: '#EDEDED',
      borderRadius: theme.border.borderRadius,
    },
    image: {
      width: '100%',
      height: 280,
      borderRadius: theme.border.borderRadius,
      overflow: 'hidden',
    },
    paginationContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      alignSelf: 'center',
      bottom: 10,
      flexDirection: 'row',
    },
    pagination: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 7,
      width: 7,
      backgroundColor: appConfigData?.primary_color,
      borderRadius: 3.5,
      marginHorizontal: 5,
    },
    activeIndicator: {
      justifyContent: 'center',
      alignItems: 'center',
      height: theme.cardPadding.defaultPadding,
      width: theme.cardPadding.defaultPadding,
      borderRadius: theme.cardPadding.defaultPadding / 2,
      borderWidth: theme.border.borderWidth,
      borderColor: appConfigData?.primary_color,
    },
    productDetails: {
      marginTop: theme.cardPadding.largeSize,
      marginHorizontal: theme.cardMargin.left,
      gap: theme.cardPadding.smallXsize,
    },
    title: {
      fontFamily: theme.fonts.DMSans.bold,
      fontSize: theme.fontSize.font24,
      color: appConfigData?.secondary_text_color,
    },
    costView: {
      flexDirection: 'row',
    },
    cost: {
      fontFamily: theme.fonts.DMSans.semiBold,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
      textDecorationLine: 'line-through',
      alignSelf: 'center',
      marginRight: 8,
    },
    discountCost: {
      fontFamily: theme.fonts.DMSans.bold,
      fontSize: theme.fontSize.font16,
      color: theme.primaryColor,
    },
    ratingView: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
      gap: 8,
    },
    loyaltyView: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
      gap: 8,
    },
    startIcon: {
      height: 16,
      width: 16,
    },
    loyaltyIcon: {
      height: 16,
      width: 16,
    },
    ratingText: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
    },
    dot: {
      height: 4,
      width: 4,
      borderRadius: 2,
      backgroundColor: '#C4C5C4',
    },
    buttonView: {
      marginVertical: theme.cardPadding.largeSize,
      paddingVertical: theme.cardPadding.defaultPadding,
      backgroundColor: appConfigData?.primary_color,
      borderRadius: theme.border.borderRadius,
      marginHorizontal: theme.cardMargin.left,
    },
    buttonText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.primary_text_color,
      alignSelf: 'center',
    },
    icon: {
      width: theme.cardPadding.mediumSize,
      height: theme.cardPadding.mediumSize,
      tintColor: appConfigData?.background_color,
    },
    buttonActive: {
      flexDirection: 'row',
      gap: theme.cardPadding.smallXsize,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.cardPadding.defaultPadding,
      borderRadius: theme.border.borderRadius,
      backgroundColor: theme.primaryColor,
      marginHorizontal: theme.cardMargin.left,
      marginVertical: theme.cardPadding.largeSize,
    },
    video: {
      flex: 1,
      borderRadius: theme.border.borderRadius,
    },
    playTrailer: {
      position: 'absolute',
      alignSelf: 'center',
      top: 140,
      borderWidth: theme.border.borderWidth,
      borderRadius: 3,
      borderColor: appConfigData?.primary_text_color,
      flexDirection: 'row',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    trailerText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font10,
      color: appConfigData?.primary_text_color,
      alignSelf: 'center',
    },
    ctaTitle: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.primary_color,
      textDecorationLine: 'underline',
      textDecorationColor: appConfigData?.primary_color,
      paddingTop: theme.cardPadding.carMargin,
    },
  });

  const renderItem = ({item, index}: {item: string; index: number}) => {
    return (
      <View
        key={index}
        style={[
          styles.content,
          {width: containerWidth},
          index === currentPage ? {marginLeft: theme.cardMargin.left} : null,
        ]}>
        {!item.match(/dev.dam/) ? (
          <FastImage
            style={styles.image}
            source={{
              uri: item,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        ) : (
          <ImageBackground source={{uri: productImage[0]}} style={{flex: 1}}>
            <LinearGradient
              colors={['#00000099', '#00000099']}
              style={{flex: 1}}>
              <TouchableOpacity
                style={styles.playTrailer}
                activeOpacity={1}
                onPress={() => {
                  navigation.navigate(ScreenNames.trailerVideoScreen, {
                    item,
                  });
                }}>
                <Image source={icons.VODIcon} />
                <Text style={styles.trailerText}>Watch Trailer</Text>
              </TouchableOpacity>
            </LinearGradient>
          </ImageBackground>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          ref={flatListRef}
          data={productData}
          contentContainerStyle={styles.flatListContainer}
          pagingEnabled
          keyExtractor={(item, index) => index.toString()}
          onScroll={handleScroll}
          renderItem={renderItem}
          scrollEventThrottle={200}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
        <View style={styles.paginationContainer}>
          {productData.map((_: any, index: any) => (
            <View
              key={index}
              style={[index === currentPage && styles.activeIndicator]}
              onTouchEnd={() => scrollToIndex(index)}>
              <View key={index} style={styles.pagination} />
            </View>
          ))}
        </View>
      </View>
      <View style={styles.productDetails}>
        <Text numberOfLines={3} style={styles.title}>
          {responseData?.ecomx_name}
        </Text>
        <View style={styles.costView}>
          {responseData.ecomx_list_price && (
            <Text style={styles.cost}>
              {getCurrencySymbol(responseData?.ecomx_currency_code)}
              {responseData?.ecomx_list_price}
            </Text>
          )}
          <Text style={styles.discountCost}>
            {getCurrencySymbol(responseData?.ecomx_currency_code)}
            {responseData?.ecomx_sale_price}
          </Text>
        </View>
        <View style={styles.ratingView}>
          <Image source={icons.ratingStar} style={styles.startIcon} />
          <Text style={styles.ratingText}>4.6</Text>
          <View style={styles.dot} />
          <Text style={styles.ratingText}>177 Reviews</Text>
        </View>

        {loyaltyPoints && (
          <View style={styles.loyaltyView}>
            <Image source={icons.loyaltyIcon} style={styles.loyaltyIcon} />
            <Text style={styles.ratingText}>
              {`Purchase and earn ${loyaltyPoints} points`}
            </Text>
          </View>
        )}

        {responseData?.attribute?.ecomx_attributes_product_360_title && (
          <Text style={styles.ctaTitle}>{`${formattedTitle ?? ''} >`}</Text>
        )}
      </View>
    </View>
  );
};

export default ImageCarousel;
