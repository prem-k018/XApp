/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
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
import LoadingScreen from '../loadingScreen/loadingScreen';
import screensUtils from '@app/utils/screensUtils';
import FastImage from 'react-native-fast-image';
import {getDateOfBirth} from '@app/utils/HelperFunction';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import ScreenNames from '@app/constants/screenNames';
import {addEventForTracking} from '@app/services/tracking/rpiServices';
import {view} from '@app/constants/constants';

const OrderHomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {appConfigData} = useAppContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const {orders} = useAppContext();

  useEffect(() => {
    const appViewTracking = async () => {
      const data = {
        ContentType: 'OrderHomeScreen',
        screenType: view,
      };
      await addEventForTracking(data);
    };
    appViewTracking();
  }, []);

  const handleRetry = () => {
    // getOrderedProduct();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 1,
    },
    topContent: {
      paddingVertical: 29,
      gap: 20,
      backgroundColor: appConfigData?.background_color,
    },
    headingView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: theme.cardMargin.left,
    },
    headingText: {
      fontFamily: theme.fonts.DMSans.bold,
      fontSize: theme.fontSize.font24,
      color: appConfigData?.secondary_text_color,
    },
    searchView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: theme.cardMargin.left,
      backgroundColor: '#FAFAFA',
      borderRadius: theme.border.borderRadius,
      paddingRight: 20,
      borderWidth: theme.border.borderWidth,
      borderColor: '#EDEDED',
    },
    placeholder: {
      paddingHorizontal: 20,
      paddingVertical: theme.cardMargin.top,
      color: appConfigData?.secondary_text_color,
      width: '90%',
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
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
      paddingVertical: theme.cardMargin.top,
      gap: theme.cardMargin.bottom,
    },
    searchText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.secondary_text_color,
      alignSelf: 'center',
    },
  });

  return isLoading ? (
    <LoadingScreen
      isLoading={isLoading}
      error={isError}
      onRetry={handleRetry}
    />
  ) : (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <View style={styles.headingView}>
          <Text style={styles.headingText}>Orders</Text>
          <Image source={icons.ListIcon} />
        </View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            navigation?.navigate(ScreenNames.searchScreen, {dataId: ''})
          }
          style={styles.searchView}>
          <Text style={[styles.placeholder, {color: '#C4C5C4'}]}>
            Search Orders
          </Text>
          <Image source={icons.search} />
        </TouchableOpacity>
      </View>
      {orders.length === 0 ? (
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
        <FlatList
          contentContainerStyle={styles.flatListView}
          data={orders
            ?.filter(item => {
              return item?.ecomx_name !== undefined;
            })
            ?.reverse()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}: any) => (
            <OrderItems data={item} index={index} />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default OrderHomeScreen;

export type Props = {
  data: any;
  index: number;
};

const OrderItems: React.FC<Props> = ({data}) => {
  const {appConfigData} = useAppContext();
  const screenWidth = screensUtils.screenWidth;
  const containerWidth =
    screenWidth - (theme.cardMargin.left + theme.cardMargin.right);
  const imageWidth = (containerWidth - (10 + 10 + 16)) / 2;

  const calculateDeliveryDate = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    return getDateOfBirth(deliveryDate as any);
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
      borderRadius: theme.border.borderRadius,
      backgroundColor: appConfigData?.background_color,
      gap: theme.cardPadding.defaultPadding,
      flexDirection: 'row',
    },
    image: {
      height: imageWidth,
      width: imageWidth,
    },
    rightSide: {
      width: imageWidth,
      height: 'auto',
      gap: 4,
      justifyContent: 'center',
    },
    title: {
      flex: 1,
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
    },
    store: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font12,
      color: appConfigData?.secondary_text_color,
    },
    ratingView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    ratingText: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font10,
      color: appConfigData?.secondary_text_color,
    },
    buttonView: {
      paddingVertical: 10,
      width: 150,
      paddingHorizontal: theme.cardMargin.left,
      backgroundColor: appConfigData?.primary_color,
      borderRadius: theme.border.borderRadius,
      marginTop: theme.cardMargin.top,
    },
    buttonText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.primary_text_color,
      alignSelf: 'center',
    },
  });

  return (
    <View style={styles.content}>
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
        <View style={styles.ratingView}>
          <Text numberOfLines={2} style={styles.title}>
            {data.ecomx_name}
          </Text>
          <Image source={icons.orderSuccessful} />
        </View>
        <Text style={styles.store}>Delivered by {calculateDeliveryDate()}</Text>
        <Text style={styles.ratingText}>
          Quantity : {data?.ecomx_quantity ? data?.ecomx_quantity : 1}
        </Text>
        <TouchableOpacity style={styles.buttonView} activeOpacity={1}>
          <Text style={styles.buttonText}>See Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
