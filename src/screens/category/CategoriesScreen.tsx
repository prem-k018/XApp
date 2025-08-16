/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';
import {icons} from '@app/assets/icons';
import DefaultHeader from '@app/components/ui-components/defaultHeader';
import CategoriesItem from '@app/components/home/CategoriesItem';
import ScreenNames from '@app/constants/screenNames';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import getShopScreenData from '@app/services/product/productList';
import LoadingScreen from '../loadingScreen/loadingScreen';

const CategoriesScreen: React.FC = ({route}: any) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [data, setData] = useState<any>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [contentPaginationStartIndex, setcontentPaginationStartIndex] =
    useState(0);
  const [totalRecords, setTotalRecord] = useState(Number.MAX_VALUE);
  const [loadingNewData, setLoadingNewData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const {dataId, title} = route.params;
  const {appConfigData} = useAppContext();

  const pageSize = 20;

  const onRefresh = () => {
    setcontentPaginationStartIndex(0);
    setRefreshing(true);
  };

  useEffect(() => {
    if (refreshing && contentPaginationStartIndex === 0) {
      getData({showLoader: !refreshing});
    }
  }, [refreshing, contentPaginationStartIndex]);

  useEffect(() => {
    if (data.length === 0) {
      getData({showLoader: true});
    }
  }, []);

  const updateData = () => {
    if (!loadingNewData) {
      setLoadingNewData(true);
      getData({showLoader: false});
    }
  };

  async function getData(options: {showLoader: boolean}) {
    const {showLoader} = options;

    try {
      if (showLoader) {
        setIsLoading(true); // Show loading indicator
        setIsError(null); // Reset the error message
      }

      const pagination = {start: contentPaginationStartIndex, rows: pageSize};

      const searchTerm = '';
      const isSuggestive = false;
      const filter: string[] = [dataId];
      const attributes: string[] = [];

      // Call the fetchGraphQLData function with input parameters
      const contents = await getShopScreenData(
        pagination,
        searchTerm,
        isSuggestive,
        filter,
        attributes,
      );

      if (
        'data' in contents &&
        contents.data.publish_getEcommerceProducts.products
      ) {
        const newData = contents?.data.publish_getEcommerceProducts.products;

        if (data.length === 0 || refreshing) {
          setData(newData);
        } else {
          setData([...data, ...newData]);
        }

        setcontentPaginationStartIndex(contentPaginationStartIndex + pageSize);
        setLoadingNewData(false);

        console.log(
          'Total Records',
          contents?.data.publish_getEcommerceProducts.total_records,
        );

        const total = contents?.data.publish_getEcommerceProducts.total_records;
        if (total !== totalRecords) {
          setTotalRecord(total);
        }
        setIsLoading(false); // Hide loading indicator when the service call is complete
      } else {
        setIsError('Something went wrong!!!!'); // Set the error message
      }
      if (refreshing) {
        setRefreshing(false);
      }
    } catch (err: any) {
      console.log(err.message);
      if (refreshing) {
        setRefreshing(false);
      }
    }
  }

  const handleRetry = () => {
    getData({showLoader: true});
  };

  const renderListHeader = () => (
    <>
      <View style={styles.topContent}>
        <View style={styles.headingView}>
          <Text style={styles.headingText}>{title}</Text>
          {/* <Image source={icons.ListIcon} /> */}
        </View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            navigation?.navigate(ScreenNames.searchScreen, {dataId: dataId})
          }
          style={styles.searchView}>
          <Text style={[styles.placeholder, {color: '#C4C5C4'}]}>
            Search Gadget Name
          </Text>
          <Image source={icons.search} />
        </TouchableOpacity>
      </View>
    </>
  );

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
    flatListView: {
      paddingBottom: theme.cardMargin.left * 2,
      gap: theme.cardMargin.left,
    },
    searchText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.secondary_text_color,
      alignSelf: 'center',
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
  });

  return isLoading ? (
    <>
      <DefaultHeader
        header="Category"
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
        header="Category"
        icon1={icons.shoppingCartIcon}
        showBadged={true}
        onPressIcon1={() => navigation?.navigate(ScreenNames.cartHomeScreen)}
      />
      <View style={styles.container}>
        {data.length === 0 ? (
          <>
            {renderListHeader()}
            <View style={styles.content}>
              <Image source={icons.searchScreenIcon} />
              <Text
                style={[styles.searchText, {marginTop: 30, marginBottom: 20}]}>
                There are no suitable products
              </Text>
              <Text
                style={[
                  styles.text,
                  {paddingHorizontal: theme.cardMargin.left},
                ]}>
                Please try using other keywords to find the product name
              </Text>
            </View>
          </>
        ) : (
          <FlatList
            contentContainerStyle={styles.flatListView}
            data={data}
            onEndReached={
              contentPaginationStartIndex > 0 &&
              contentPaginationStartIndex < totalRecords
                ? updateData
                : null
            }
            initialNumToRender={5}
            windowSize={9}
            scrollEventThrottle={200}
            ListHeaderComponent={renderListHeader()}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <CategoriesItem data={item} index={index} />
            )}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="gray"
              />
            }
          />
        )}
      </View>
    </>
  );
};

export default CategoriesScreen;
