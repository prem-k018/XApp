/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Text,
} from 'react-native';
import LoadingScreen from '../loadingScreen/loadingScreen';
import {theme} from '@app/constants';
import {sessionTimeout} from '@app/constants/errorCodes';
import {useAppContext} from '@app/store/appContext';
import TopCarousel from '@app/components/home/TopCarousel';
import CategoryCarousel from '@app/components/home/CategoryCarousel';
import CategoriesItem from '@app/components/home/CategoriesItem';
import getCategoryListData from '@app/services/categoryList';
import {Category} from '@app/model/categoryList';
import getShopScreenData from '@app/services/product/productList';
import {Product} from '@app/model/product/productList';
import {showSessionExpiredAlert} from '@app/services/sessionExpiredService';
import ScreenNames from '@app/constants/screenNames';
import {view} from '@app/constants/constants';
import {addEventForTracking} from '@app/services/tracking/rpiServices';

const ShopHomeScreen: React.FC = () => {
  const {appConfigData} = useAppContext();
  const flatListRef = useRef<FlatList<any> | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [data, setData] = useState<Product[]>([]);
  const [categoryData, setCategoryData] = useState<Category[]>([]);

  const [topCarousel, setTopCarousel] = useState<Product[]>([]);
  const [contentPaginationStartIndex, setcontentPaginationStartIndex] =
    useState(0);
  const [totalRecords, setTotalRecord] = useState(Number.MAX_VALUE);
  const [loadingNewData, setLoadingNewData] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);

  const pageSize = 20;

  useEffect(() => {
    const appViewTracking = async () => {
      const data = {
        ContentType: ScreenNames.shopHomeScreen,
        screenType: view,
      };
      await addEventForTracking(data);
    };
    appViewTracking();
  }, []);

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
      if (data.length === 0 || refreshing) {
        const categoryList = await getCategoryListData();
        if (
          'data' in categoryList &&
          categoryList?.data?.publish_getEcommerceCategories?.length > 0
        ) {
          setCategoryData(categoryList?.data?.publish_getEcommerceCategories);
        }
      }

      const searchTerm = '';
      const isSuggestive = false;
      const filter: string[] = [];
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
        contents?.data?.publish_getEcommerceProducts?.products?.length > 0
      ) {
        const newData =
          contents?.data?.publish_getEcommerceProducts?.products ?? [];

        if (data.length === 0 || refreshing) {
          setData(newData);
          const topData = newData.filter(
            content => content?.ecomx_attributes_brand === 'LIRAMARK',
          );

          setTopCarousel(topData);
        } else {
          setData([...data, ...newData]);
        }

        setcontentPaginationStartIndex(contentPaginationStartIndex + pageSize);
        setLoadingNewData(false);

        console.log(
          'Total Records',
          contents?.data?.publish_getEcommerceProducts?.total_records,
        );

        const total =
          contents?.data?.publish_getEcommerceProducts?.total_records;
        if (total !== totalRecords) {
          setTotalRecord(total);
        }
        setIsLoading(false); // Hide loading indicator when the service call is complete
      } else if ('data' in contents && contents?.errors?.[0]) {
        showSessionExpiredAlert();
        console.log('Error', contents?.errors?.[0]?.message);
      } else {
        setIsError('Something went wrong!!!!'); // Set the error message
        setIsLoading(true);
      }
      if (refreshing) {
        setRefreshing(false);
      }
    } catch (err: any) {
      console.log(err.message);
      if (refreshing) {
        setRefreshing(false);
      }
      if (err.message !== sessionTimeout) {
        setIsError('Something went wrong!!!!'); // Set the error message
      }
      setIsLoading(true);
    }
  }

  const handleRetry = () => {
    getData({showLoader: true});
  };

  const renderListHeader = () => {
    return (
      <>
        <TopCarousel data={topCarousel} />
        {/* <CategoryCarousel data={categoryData} /> */}
        <Text style={styles.headingText}>FEATURED PRODUCT</Text>
      </>
    );
  };

  const styles = StyleSheet.create({
    contentContainer: {
      gap: theme.cardMargin.left,
      paddingBottom: theme.cardMargin.left,
    },
    container: {
      paddingTop: 1,
      flex: 1,
    },
    loading: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 8,
      margin: 10,
    },
    headingText: {
      paddingLeft: theme.cardMargin.left,
      paddingTop: 24,
      color: appConfigData?.secondary_text_color,
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font16,
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
      <FlatList
        ref={flatListRef}
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
        keyExtractor={(item, index) => `${item.Id}${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        renderItem={({item, index}) => (
          <CategoriesItem data={item} index={index} />
        )}
        ListHeaderComponent={renderListHeader()}
        numColumns={2}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="gray"
          />
        }
      />
      {loadingNewData && (
        <View style={[styles.container, styles.loading]}>
          <ActivityIndicator size="small" />
        </View>
      )}
    </View>
  );
};

export default ShopHomeScreen;
