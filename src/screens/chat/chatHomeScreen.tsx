/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import getHomeScreenData from '@app/services/homeScreenService';
import {Content} from '@app/model/content';
import LoadingScreen from '../loadingScreen/loadingScreen';
import PlayerTeamsCard from '@app/components/cards/playerTeamsCard';
import PlayerCard from '@app/components/cards/playerCard';
import {sessionTimeout} from '@app/constants/errorCodes';

const renderItem = (item: (Content | Content[])[]) => {
  if (Array.isArray(item)) {
    return <PlayerTeamsCard />;
  } else {
    return <PlayerCard data={item} />;
  }
};

const ChatHomeScreen: React.FC = () => {
  const flatListRef = useRef<FlatList<any> | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<(Content | Content[])[]>([]); //Temporarily until carousel structure is defined
  const [contentPaginationStartIndex, setcontentPaginationStartIndex] =
    useState(0);
  const [totalRecords, setTotalRecord] = useState(Number.MAX_VALUE);
  const [loadingNewData, setLoadingNewData] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const pageSize = 20;

  const onRefresh = () => {
    setcontentPaginationStartIndex(0);
    setRefreshing(true);
  };

  // Make sure getData only gets called after data array and pagination index is reset
  useEffect(() => {
    if (refreshing && contentPaginationStartIndex === 0) {
      getData({showLoader: !refreshing});
    }
  }, [refreshing, contentPaginationStartIndex]);

  useEffect(() => {
    getData({showLoader: true});
  }, []);

  const updateData = () => {
    if (!loadingNewData) {
      setLoadingNewData(true);
      getData({showLoader: false});
    }
  };
  async function getData(options: {showLoader: boolean}) {
    const {showLoader} = options;
    let tagLists: string[] = ['Profiles'];
    try {
      if (showLoader) {
        setIsLoading(true); // Show loading indicator
        setIsError(null); // Reset the error message
      }

      const pagination = {start: contentPaginationStartIndex, rows: pageSize};
      const FEATURED_ITEMS_PAGE_SIZE = 50;
      if (data.length === 0 || refreshing) {
        pagination.rows = FEATURED_ITEMS_PAGE_SIZE;
      }

      const searchTerm = '';
      const tags = tagLists;
      const filter = 'ALL';

      // Call the fetchGraphQLData function with input parameters
      const contents = await getHomeScreenData(
        pagination,
        searchTerm,
        tags,
        filter,
      );

      if ('data' in contents && contents.data.publish_getContents.records) {
        let newData = contents?.data.publish_getContents.records;

        // Temporary until carousel is integrated into the data pulled from API
        //  Until then keeping as static test data
        if (data.length === 0 || refreshing) {
          newData.splice(0, 0, []);
          setData(newData);
          if (data.length === 0 || refreshing) {
            pagination.rows = FEATURED_ITEMS_PAGE_SIZE;
            setcontentPaginationStartIndex(
              contentPaginationStartIndex + FEATURED_ITEMS_PAGE_SIZE,
            );
          } else {
            setcontentPaginationStartIndex(
              contentPaginationStartIndex + pageSize,
            );
          }
        } else {
          setData([...data, ...newData]);
        }
        setLoadingNewData(false);

        console.log(
          'Total Records1111:',
          contents?.data.publish_getContents.total_records,
        );

        const total = contents?.data.publish_getContents.total_records;
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

      if (err.message !== sessionTimeout) {
        setIsError('Something went wrong!!!!'); // Set the error message
      }
    }
  }

  const handleRetry = () => {
    getData({showLoader: true});
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
        ref={flatListRef}
        data={data}
        onEndReached={
          contentPaginationStartIndex > 0 && data.length < totalRecords
            ? updateData
            : null
        }
        initialNumToRender={5}
        windowSize={21}
        keyExtractor={(item, index) => `${item.Id}${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        renderItem={({item}) => renderItem(item)}
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

const styles = StyleSheet.create({
  contentContainer: {
    //paddingTop: theme.cardMargin.top,
  },
  container: {
    flex: 1,
  },
  loading: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    margin: 10,
  },
});

export default ChatHomeScreen;
