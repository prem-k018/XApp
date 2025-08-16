/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from 'react-native';
import React, {useState} from 'react';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';
import {icons} from '@app/assets/icons';
import LoadingScreen from '@app/screens/loadingScreen/loadingScreen';
import CategoriesItem from '../../components/home/CategoriesItem';
import getShopScreenData from '@app/services/product/productList';
import {Product} from '@app/model/product/productList';
import DefaultHeader from '../../components/ui-components/defaultHeader';

export type Props = {
  route: any;
};

const SearchScreen: React.FC<Props> = ({route}) => {
  const {dataId} = route.params;
  const {appConfigData} = useAppContext();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [contentPaginationStartIndex, setcontentPaginationStartIndex] =
    useState(0);
  const [totalRecords, setTotalRecord] = useState(Number.MAX_VALUE);
  const [loadingNewData, setLoadingNewData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [searchedTerm, setSearchedTerm] = useState<string>('');
  const [searchedData, setSearchedData] = useState<Product[]>([]);
  const [totals, setTotals] = useState<number>(0);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);

  const pageSize = 20;

  const suggestions = [
    'iPhone',
    'MacBook',
    'Charger',
    'Samsung Galaxy',
    'Sony Headphones',
    'Dell Laptop',
    'Wireless Mouse',
    'Smart Watch',
    'Bluetooth Speaker',
    'Nike Sneakers',
    'Adidas T-Shirt',
    'Under Armour Shorts',
    'Levi’s Jeans',
    'Puma Hoodie',
    'Reebok Gym Bag',
    'Gaming Console',
    'PlayStation 5',
    'Xbox Series X',
    'Apple AirPods',
    'Smart TV',
    'Bluetooth Earbuds',
    '4K Monitor',
    'Wireless Keyboard',
    'Fitness Tracker',
    'Drones',
    'Camera Lens',
    'Graphic Card',
    'Electric Guitar',
    'Vinyl Records',
    'Streaming Device',
    'Board Games',
  ];

  const onRefresh = () => {
    setcontentPaginationStartIndex(0);
    setRefreshing(true);
  };

  const updateData = () => {
    if (!loadingNewData) {
      setLoadingNewData(true);
      getSearchedData(
        {showLoader: false},
        searchedTerm,
        contentPaginationStartIndex,
      );
    }
  };

  async function getSearchedData(
    options: {showLoader: boolean},
    searchTerm: string,
    startIndex: number,
  ) {
    const {showLoader} = options;

    try {
      if (showLoader) {
        setIsLoading(true);
        setIsError(null);
      }

      const pagination = {start: startIndex, rows: pageSize};

      const isSuggestive = false;
      const filter: string[] = dataId ? [dataId] : [];
      const attributes: string[] = [];

      const contents = await getShopScreenData(
        pagination,
        searchTerm,
        isSuggestive,
        filter,
        attributes,
      );

      if (
        'data' in contents &&
        contents?.data?.publish_getEcommerceProducts?.products
      ) {
        const newData = contents?.data?.publish_getEcommerceProducts?.products;
        if (startIndex === 0) {
          setSearchedData(newData);
        } else {
          setSearchedData(prevData => [...prevData, ...newData]);
        }

        setcontentPaginationStartIndex(prevIndex => prevIndex + pageSize);
        setLoadingNewData(false);
        console.log('Searched Data ===> ', newData.length);

        if (searchTerm !== '' && !searchHistory.includes(searchTerm)) {
          setSearchHistory(prevHistory => [...prevHistory, searchTerm]);
        }

        console.log(
          'Total Records',
          contents?.data?.publish_getEcommerceProducts?.total_records,
        );

        const total =
          contents?.data?.publish_getEcommerceProducts?.total_records;
        setTotals(total);
        if (total !== totalRecords) {
          setTotalRecord(total);
        }
        setIsLoading(false);
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
    getSearchedData(
      {showLoader: true},
      searchedTerm,
      contentPaginationStartIndex,
    );
  };

  const handleSearch = (search?: string) => {
    const searchTerm = search ? search : searchedTerm;
    setcontentPaginationStartIndex(0);
    setSearchedData([]);
    setIsSearched(true);
    getSearchedData({showLoader: true}, searchTerm, 0);
  };

  const deleteSearchTerm = (index: number) => {
    const updatedSearchHistory = [...searchHistory];
    updatedSearchHistory.splice(index, 1);
    setSearchHistory(updatedSearchHistory);
  };

  const searchHistoryTerm = (item: string) => {
    console.log('Searched item ===> ', item);
    setSearchedTerm(item);
    Keyboard.dismiss();
    handleSearch(item);
  };

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchedTerm.toLowerCase()),
  );

  const Suggestions = () => (
    <>
      <Text style={styles.suggestionsText}>Suggestions</Text>
      {filteredSuggestions.map((item: string, index: number) => (
        <TouchableOpacity
          onPress={() => searchHistoryTerm(item)}
          key={index}
          style={styles.searchItem}
          activeOpacity={1}>
          <Image source={icons.search} style={styles.searchIcon} />
          <Text
            key={index}
            style={[styles.text, {color: appConfigData?.secondary_text_color}]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </>
  );

  const SearchHistory = () => (
    <>
      <Text style={styles.suggestionsText}>Recently Searched</Text>
      {searchHistory.map((item: string, index: number) => (
        <TouchableOpacity
          key={index}
          onPress={() => searchHistoryTerm(item)}
          activeOpacity={1}
          style={styles.searchItem}>
          <Image source={icons.cardClock} style={styles.clockIcon} />
          <Text
            style={[styles.text, {color: appConfigData?.secondary_text_color}]}>
            {item}
          </Text>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => deleteSearchTerm(index)}
            style={styles.crossIcon}>
            <Image
              source={icons.cross}
              style={{tintColor: appConfigData?.secondary_text_color}}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </>
  );

  const ResultNotFound = () => (
    <View style={styles.content}>
      <Image source={icons.searchScreenIcon} />
      <Text style={[styles.searchText, {marginTop: 30, marginBottom: 20}]}>
        There are no suitable products
      </Text>
      <Text style={[styles.text, {paddingHorizontal: theme.cardMargin.left}]}>
        Please try using other keywords to find the product name
      </Text>
    </View>
  );

  const Result = () => (
    <>
      <FlatList
        contentContainerStyle={styles.flatListView}
        data={searchedData}
        onEndReached={
          contentPaginationStartIndex > 0 &&
          contentPaginationStartIndex < totalRecords
            ? updateData
            : null
        }
        initialNumToRender={5}
        windowSize={9}
        scrollEventThrottle={200}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <CategoriesItem data={item} index={index} />
        )}
        numColumns={2}
        showsHorizontalScrollIndicator={false}
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
    </>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 1,
      paddingTop: theme.cardMargin.top,
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
    headerView: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 15,
      marginBottom: 30,
    },
    searchBackIcon: {
      position: 'absolute',
      left: theme.cardPadding.defaultPadding,
      alignSelf: 'center',
      top: theme.cardPadding.defaultPadding,
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
    searchContainer: {
      paddingHorizontal: theme.cardMargin.left,
      marginTop: 30,
      gap: 25,
    },
    suggestionsText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
    },
    searchItem: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'row',
      gap: 10,
    },
    searchIcon: {
      tintColor: '#C4C5C4',
      alignSelf: 'center',
    },
    clockIcon: {
      height: 24,
      width: 24,
      tintColor: '#C4C5C4',
    },
    crossIcon: {
      position: 'absolute',
      right: 0,
    },
    flatListView: {
      paddingVertical: 30,
      gap: 24,
    },
    loading: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 8,
      margin: 10,
    },
  });

  return isLoading ? (
    <>
      <DefaultHeader header="Search" />
      <LoadingScreen
        isLoading={isLoading}
        error={isError}
        onRetry={handleRetry}
      />
    </>
  ) : (
    <>
      <DefaultHeader header="Search" />
      <View style={styles.container}>
        <View style={styles.searchView}>
          <TextInput
            placeholder="Search Product Name"
            style={styles.placeholder}
            placeholderTextColor="#C4C5C4"
            autoFocus={true}
            value={searchedTerm}
            onChangeText={text => {
              setSearchedTerm(text);
              setIsSearched(false);
            }}
            onSubmitEditing={() => handleSearch('')}
          />
          <TouchableOpacity activeOpacity={1} onPress={() => handleSearch('')}>
            <Image source={icons.search} />
          </TouchableOpacity>
        </View>
        {!isSearched ? (
          <ScrollView
            contentContainerStyle={styles.searchContainer}
            keyboardShouldPersistTaps="handled">
            {searchHistory.length > 0 && searchedTerm === '' ? (
              <>
                <SearchHistory />
                <Suggestions />
              </>
            ) : (
              <Suggestions />
            )}
          </ScrollView>
        ) : totals === 0 ? (
          <ResultNotFound />
        ) : (
          <Result />
        )}
      </View>
    </>
  );
};

export default SearchScreen;
