/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useAppContext} from '@app/store/appContext';
import {icons} from '@app/assets/icons';
import {theme} from '@app/constants';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ScreenNames from '@app/constants/screenNames';
import {Category} from '@app/model/categoryList';

export type Props = {
  data: Category[];
};

const CategoryCarousel: React.FC<Props> = ({data}) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {appConfigData} = useAppContext();

  const renderItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() =>
          navigation.navigate(ScreenNames.categoryScreen, {
            dataId: item.id,
            title: item.name,
          })
        }
        style={[
          styles.content,
          index === data.length - 1 && {marginRight: 1},
          index === 0 && {marginLeft: 1},
        ]}>
        <View style={[styles.imageView, {backgroundColor: item.color}]}>
          <Image source={getIconName(item.name)} />
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  function getIconName(name: string) {
    switch (name) {
      case 'Zagg':
        return icons.homeDecor;
      case 'Power':
        return icons.trouser;
      case 'Cases':
        return icons.adhesiveCardHolder;
      case 'Purchase Warranty':
        return icons.dataCardDongles;
      case 'Apple':
        return icons.books;
      case 'Extend warranty':
        return icons.holidayPackage;
      case 'CDS':
        return icons.feyenoord;
      case 'England Cricket Board':
        return icons.nonFictionBooks;
      case 'Ticket Class':
        return icons.fictionBooks;
      case "ECB Men's Fashion":
        return icons.westernWear;
      case 'Tickets':
        return icons.hockeyAustralia;
      case 'Samsung':
        return icons.shirts;
      case "ECB Women's Fashion":
        return icons.hockeyEd;
      case 'Food & Beverages':
        return icons.formalShirts;
      case 'Mobile Phones':
        return icons.mobilePhones;
      case 'sports':
        return icons.sports;
      case 'Opro Mouthguards':
        return icons.oproMouthguards;
      case 'Trousers':
        return icons.trousers;
      case 'Jacks':
        return icons.jacks;
      case 'Dresses & Jumpsuits':
        return icons.dressesJumpsuits;
      case 'Australian Championships':
        return icons.australianChampionships;
      case 'Screen Protectors':
        return icons.mobileAccessories;
      case 'Replica Apparel':
        return icons.replicaApparel;
      case 'Other Admin Fees':
        return icons.otherAdminFees;
      case 'Supporter Apparel':
        return icons.supporterApparel;
      case 'Camera Privacy Cover':
        return icons.cameraPrivacyCover;
      case 'Trouser':
        return icons.trouser;
      case 'Mobile Broadband devices':
        return icons.mobileBroadbandDevices;
      case 'Casual Shirts':
        return icons.casualShirts;
      case 'Cables & Adapters':
        return icons.cablesAdapters;
      case 'Power':
        return icons.adhesiveCardHolder;
      case 'mophie':
        return icons.dataCardDongles;
      case 'Verizon':
        return icons.trouser;
      default:
        return icons.cameraPrivacyCover;
    }
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: appConfigData?.background_color,
      paddingBottom: theme.cardPadding.largeSize,
      gap: theme.cardMargin.bottom,
    },
    heading: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: theme.cardMargin.left,
    },
    headingText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.secondary_text_color,
      alignSelf: 'center',
    },
    content: {
      alignItems: 'center',
      gap: theme.cardMargin.bottom / 2,
      height: '100%',
      width: 80,
    },
    imageView: {
      height: 48,
      width: 48,
      borderRadius: theme.border.borderRadius,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
      alignSelf: 'center',
      textAlign: 'center',
      marginHorizontal: 4,
    },
    seeAllText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font12,
      color: appConfigData?.primary_color,
      alignSelf: 'center',
    },
  });

  if (data.length === 0) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.headingText}>Categories</Text>
        <TouchableOpacity
          onPress={() => console.log('See all Categories')}
          activeOpacity={1}>
          {/* <Text style={styles.seeAllText}>See all</Text> */}
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default CategoryCarousel;
