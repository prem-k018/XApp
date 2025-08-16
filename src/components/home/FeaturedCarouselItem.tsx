/* eslint-disable react/self-closing-comp */
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useAppContext} from '@app/store/appContext';
import {loadImageForHomePage} from '@app/utils/imageLinkUtils';
import {theme} from '@app/constants';
import FastImage from 'react-native-fast-image';
import {icons} from '@app/assets/icons';
import screensUtils from '@app/utils/screensUtils';
import {useHandleRetailCardClick} from '@app/deeplinks/retailCardDeeplinks';
import ScreenNames from '@app/constants/screenNames';
import { button } from '@app/constants/constants';
import { addEventForTracking } from '@app/services/tracking/rpiServices';

export type Props = {
  data: any;
  index: number;
};

const FeaturedCarouselItem: React.FC<Props> = ({data, index}) => {
  const {appConfigData} = useAppContext();
  const screenWidth = screensUtils.screenWidth;
  const totalWidth =
    screenWidth -
    (theme.cardMargin.left + theme.cardMargin.right + theme.cardMargin.left);
  const containerWidth = totalWidth / 2;
  const cardClickHandle = useHandleRetailCardClick(data);
  const {addToCart, removeFromCart, isInCart} = useAppContext();

  const handleAddToCart = () => {
    const button_Data = {ContentType: ScreenNames.categoryScreen,screenType:button,button_name:"add_to_cart_button"};
    addEventForTracking(button_Data);
    addToCart(data);
  };

  const result = loadImageForHomePage(data);

  const styles = StyleSheet.create({
    content: {
      width: containerWidth,
      paddingVertical: theme.cardPadding.defaultPadding,
      paddingHorizontal: 10,
      marginRight: theme.cardMargin.right,
      borderRadius: theme.border.borderRadius,
      backgroundColor: appConfigData?.background_color,
      gap: theme.cardPadding.defaultPadding,
    },
    image: {
      height: 130,
      width: '100%',
      alignSelf: 'center',
      backgroundColor: theme.colors.grayScale6,
    },
    title: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
      paddingBottom: 10,
    },
    cost: {
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
      gap: 3,
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
      paddingHorizontal: theme.cardMargin.right,
      borderRadius: theme.border.borderRadius,
      backgroundColor: appConfigData?.primary_color,
    },
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={cardClickHandle}
      style={[
        styles.content,
        index === data.length - 1 && {marginRight: theme.cardMargin.right},
        index === 0 && {marginLeft: theme.cardMargin.left},
      ]}>
      {result.isColor ? (
        <View style={[styles.image, {backgroundColor: result.value}]}></View>
      ) : (
        <FastImage
          style={styles.image}
          source={{
            uri: result.value,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}
      <View>
        <Text numberOfLines={1} style={styles.title}>
          {data.Title}
        </Text>
        <View style={styles.productDetails}>
          <Text style={styles.cost}>₹1,500</Text>
          <View style={styles.ratingView}>
            <Image source={icons.ratingStar} />
            <Text style={styles.ratingText}>4.6</Text>
          </View>
        </View>
      </View>
      {!isInCart[data.Id] ? (
        <TouchableOpacity
          onPress={handleAddToCart}
          activeOpacity={1}
          style={styles.buttonView}>
          <Text style={styles.buttonText}>Add to Cart</Text>
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

export default FeaturedCarouselItem;
