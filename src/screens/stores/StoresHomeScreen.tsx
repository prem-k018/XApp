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
import {Content} from '@app/model/content';
import getHomeScreenData from '@app/services/homeScreenService';
import LoadingScreen from '../loadingScreen/loadingScreen';
import StoresItem from '@app/components/home/StoresItem';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const StoresHomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const {appConfigData} = useAppContext();
  const [storesData, setStoresData] = useState<(Content | Content[])[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const pageSize = 50;

  useEffect(() => {
    if (storesData.length === 0) {
      getData({showLoader: true});
    }
  }, []);

  async function getData(options: {showLoader: boolean}) {
    const {showLoader} = options;

    try {
      if (showLoader) {
        setIsLoading(true); // Show loading indicator
        setIsError(null); // Reset the error message
      }

      const pagination = {start: 0, rows: pageSize};
      const searchTerm = '';
      const tags: string[] = [];
      const filter = 'ALL';

      // Call the fetchGraphQLData function with input parameters
      const contents = await getHomeScreenData(
        pagination,
        searchTerm,
        tags,
        filter,
      );

      if ('data' in contents && contents.data.publish_getContents.records) {
        const newData = contents?.data.publish_getContents.records;

        const newStoreData: (Content | Content[])[] = newData.filter(
          content =>
            Array.isArray(content.tags) && content.tags.includes('Stores'),
        );
        setStoresData(newStoreData);
        setIsLoading(false); // Hide loading indicator when the service call is complete
      } else {
        setIsError('Something went wrong!!!!'); // Set the error message
      }
      if (refreshing) {
        setRefreshing(false);
      }
      setIsLoading(false); // Hide loading indicator when the service call is complete
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
      paddingVertical: theme.cardMargin.top,
      gap: theme.cardMargin.bottom,
    },
  });

  const refreshScreenData = () => {
    getData({showLoader: false});
  };

  return isLoading ? (
    <LoadingScreen
      isLoading={isLoading}
      error={isError}
      onRetry={handleRetry}
    />
  ) : (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.flatListView}
        data={storesData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}: any) => (
          <StoresItem data={item} index={index} />
        )}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshScreenData}
            tintColor="gray"
          />
        }
      />
    </View>
  );
};

export default StoresHomeScreen;
