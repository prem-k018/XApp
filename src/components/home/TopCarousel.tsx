/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/no-unstable-nested-components */
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';
import {icons} from '@app/assets/icons';
import FastImage from 'react-native-fast-image';
import {useHandleRetailCardClick} from '@app/deeplinks/retailCardDeeplinks';
import ScreenNames from '@app/constants/screenNames';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

export type Props = {
  data: any;
};

const TopCarousel: React.FC<Props> = ({data}) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {appConfigData} = useAppContext();

  const RenderItem = ({item, index}: any) => {
    const cardClickHandle = useHandleRetailCardClick(item);

    let imageObj = '';
    if (item.attr_images?.length > 0) {
      imageObj = item.attr_images[0];
    }

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={cardClickHandle}
        style={[
          styles.content,
          index === data.length - 1 && {marginRight: theme.cardMargin.right},
          index === 0 && {marginLeft: theme.cardMargin.left},
        ]}>
        <View style={styles.leftSide}>
          <Text numberOfLines={2} style={styles.title}>
            {item.ecomx_name}
          </Text>
          <View style={styles.shopView}>
            <Text style={styles.shopText}>Shop now</Text>
            <Image source={icons.backwardArrow} style={styles.icon} />
          </View>
        </View>
        {imageObj && (
          <FastImage
            style={styles.image}
            source={{
              uri: imageObj,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        )}
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    container: {
      paddingVertical: theme.cardPadding.largeSize,
      backgroundColor: appConfigData?.background_color,
      gap: 30,
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
    flatListView: {
      gap: 10,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingLeft: 20,
      height: 150,
      width: 325,
      borderRadius: theme.border.borderRadius,
      overflow: 'hidden',
      backgroundColor: appConfigData?.primary_color,
      gap: 10,
    },
    image: {
      height: 135,
      width: 141,
      borderRadius: theme.border.borderRadius,
    },
    leftSide: {
      width: 146,
      height: '100%',
      justifyContent: 'center',
      gap: 10,
    },
    title: {
      fontFamily: theme.fonts.DMSans.bold,
      fontSize: theme.fontSize.font20,
      color: appConfigData?.primary_text_color,
    },
    shopView: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    shopText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: '#FFFFFF80',
      marginRight: 12,
    },
    icon: {
      height: 14,
      width: 14,
      transform: [{rotate: '180deg'}],
      tintColor: appConfigData?.background_color,
    },
  });

  return (
    <View style={[styles.container, data.length !== 0 ? {gap: 30} : {gap: 0}]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() =>
          navigation?.navigate(ScreenNames.searchScreen, {dataId: ''})
        }
        style={styles.searchView}>
        <Text style={[styles.placeholder, {color: '#C4C5C4'}]}>
          Search Product Name
        </Text>
        <Image source={icons.search} />
      </TouchableOpacity>
      <FlatList
        contentContainerStyle={styles.flatListView}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => <RenderItem item={item} index={index} />}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default TopCarousel;
