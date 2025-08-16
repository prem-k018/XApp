import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useAppContext} from '@app/store/appContext';
import DefaultHeader from '@app/components/ui-components/defaultHeader';
import DropDownPicker from 'react-native-dropdown-picker';
import {theme} from '@app/constants';
import {icons} from '@app/assets/icons';
import getMemberReawardList from '@app/services/rewards/rewardListService';
import getMemberIssuedReawardList from '@app/services/rewards/issuedRewardList';
import {Reward} from '@app/model/rewards/rewardList';
import LoadingScreen from '../loadingScreen/loadingScreen';
import {IssuedReward} from '@app/model/rewards/issuedRewardList';
import getExpiredReawardList from '@app/services/rewards/expiredReward';
import {Point} from '@app/model/rewards/expiredReward';
import AvailableRewardsItem from '@app/components/rewards/AvailableRewardsItem';
import MyRewardsItem from '@app/components/rewards/MyRewardsItem';
import ExpiringRewardsItem from '@app/components/rewards/ExpiringRewardsItem';
import screensUtils from '@app/utils/screensUtils';
import StorageService from '@app/utils/storageService';
import {userMemberId} from '@app/constants/constants';
import NoDataScreen from '../loadingScreen/NoDataScreen';

const RewardManagement: React.FC = () => {
  const {appConfigData} = useAppContext();

  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
  const [rewardValue, setRewardValue] = useState<string>('Available Rewards');
  const [isSearchBarVisible, setIsSearchBarVisible] = useState<boolean>(false);
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const [selectValue, setSelectValue] = useState<string>('Available Rewards');

  const [availableRewards, setAvailableRewards] = useState<Reward[]>([]);
  const [myRewardsData, setMyRewardsData] = useState<IssuedReward[]>([]);
  const [usedRewardsData, setUsedRewardsData] = useState<IssuedReward[]>([]);
  const [expiringRewardsData, setExpiringRewardsData] = useState<Point[]>([]);

  const [availableRewardsPageIndex, setAvailableRewardsPageIndex] = useState(1);
  const [myRewardsPageIndex, setMyRewardsPageIndex] = useState(1);
  const [usedRewardsPageIndex, setUsedRewardsPageIndex] = useState(1);
  const [expiringRewardsPageIndex, setExpiringRewardsPageIndex] = useState(1);

  const [availableTotal, setAvailableTotal] = useState(Number.MAX_VALUE);
  const [myRewardsTotal, setMyRewardsTotal] = useState(Number.MAX_VALUE);
  const [usedRewardsTotal, setUsedRewardsTotal] = useState(Number.MAX_VALUE);
  const [expiringRewardsTotal, setExpiringRewardsTotal] = useState(
    Number.MAX_VALUE,
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchMoreAR, setFetchMoreAR] = useState<boolean>(false);
  const [fetchMoreMR, setFetchMoreMR] = useState<boolean>(false);
  const [fetchMoreUR, setFetchMoreUR] = useState<boolean>(false);
  const [fetchMoreER, setFetchER] = useState<boolean>(false);

  const [isError, setIsError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterTerm, setFilterTerm] = useState<string>('desc');
  const [filterId, setFilterId] = useState<string>('default');
  const [filterApplied, setFilterApplied] = useState<boolean>(false);
  const searchInputRef = useRef<TextInput>(null);

  const pageSize = 5;
  const screenWidth = screensUtils.screenWidth;
  const dropdownWidth = screenWidth - (16 + 20 + 20 + 20 + 20 + 16);

  useEffect(() => {
    resetDataAndFetch(true);
  }, []);

  useEffect(() => {
    if (isSearchBarVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchBarVisible]);

  const rewards = [
    {
      label: 'Available Rewards',
      value: 'Available Rewards',
    },
    {
      label: 'My Rewards',
      value: 'My Rewards',
    },
    {
      label: 'Used Rewards',
      value: 'Used Rewards',
    },
    {
      label: 'Expiring Rewards',
      value: 'Expiring Rewards',
    },
  ];

  const filterData = [
    {
      id: 'default',
      label: 'Default',
      value: 'desc',
    },
    {
      id: 'asc',
      label: 'Ascending',
      value: 'asc',
    },
    {
      id: 'desc',
      label: 'Descending',
      value: 'desc',
    },
  ];

  const handleDropdownChange = (item: any) => {
    setSelectValue(item.value);
    setRewardValue(item.value);
    setSearchTerm('');
    setIsSearchBarVisible(false);
    switch (item.value) {
      case 'Available Rewards':
        setAvailableRewards([]);
        setAvailableRewardsPageIndex(1);
        setAvailableTotal(Number.MAX_VALUE);
        fetchAvailableRewards(true, filterTerm, searchTerm, true, 1);
        break;
      case 'My Rewards':
        setMyRewardsData([]);
        setMyRewardsPageIndex(1);
        setMyRewardsTotal(Number.MAX_VALUE);
        fetchMyRewards(true, filterTerm, searchTerm, true, 1);
        break;
      case 'Used Rewards':
        setUsedRewardsData([]);
        setUsedRewardsPageIndex(1);
        setUsedRewardsTotal(Number.MAX_VALUE);
        fetchUsedRewards(true, filterTerm, searchTerm, true, 1);
        break;
      case 'Expiring Rewards':
        setExpiringRewardsData([]);
        setExpiringRewardsPageIndex(1);
        setExpiringRewardsTotal(Number.MAX_VALUE);
        fetchExpiredRewards(true, filterTerm, searchTerm, true, 1);
        break;
      default:
        break;
    }
  };

  const handleSearch = (text: string) => {
    setSearchTerm(text);
  };

  const handleSearchSubmit = () => {
    resetDataAndFetch(true);
  };

  const handleFilterSearch = (id: string, term: string) => {
    setFilterTerm(term);
    setFilterId(id);
    setFilterApplied(id !== 'default');
    switch (selectValue) {
      case 'Available Rewards':
        setAvailableRewards([]);
        setAvailableRewardsPageIndex(1);
        setAvailableTotal(Number.MAX_VALUE);
        fetchAvailableRewards(true, term, searchTerm, true, 1);
        break;
      case 'My Rewards':
        setMyRewardsData([]);
        setMyRewardsPageIndex(1);
        setMyRewardsTotal(Number.MAX_VALUE);
        fetchMyRewards(true, term, searchTerm, true, 1);
        break;
      case 'Used Rewards':
        setUsedRewardsData([]);
        setUsedRewardsPageIndex(1);
        setUsedRewardsTotal(Number.MAX_VALUE);
        fetchUsedRewards(true, term, searchTerm, true, 1);
        break;
      case 'Expiring Rewards':
        setExpiringRewardsData([]);
        setExpiringRewardsPageIndex(1);
        setExpiringRewardsTotal(Number.MAX_VALUE);
        fetchExpiredRewards(true, term, searchTerm, true, 1);
        break;
      default:
        break;
    }
    setIsFilterVisible(false);
  };

  const handleSearchCancel = () => {
    setIsSearchBarVisible(false);
    setSearchTerm('');
    resetDataAndFetch();
  };

  const resetDataAndFetch = (reset = false) => {
    switch (selectValue) {
      case 'Available Rewards':
        setAvailableRewards([]);
        setSearchTerm('');
        setAvailableRewardsPageIndex(1);
        setAvailableTotal(Number.MAX_VALUE);
        fetchAvailableRewards(true, filterTerm, searchTerm, reset, 1);
        break;
      case 'My Rewards':
        setMyRewardsData([]);
        setSearchTerm('');
        setMyRewardsPageIndex(1);
        setMyRewardsTotal(Number.MAX_VALUE);
        fetchMyRewards(true, filterTerm, searchTerm, reset, 1);
        break;
      case 'Used Rewards':
        setUsedRewardsData([]);
        setSearchTerm('');
        setUsedRewardsPageIndex(1);
        setUsedRewardsTotal(Number.MAX_VALUE);
        fetchUsedRewards(true, filterTerm, searchTerm, reset, 1);
        break;
      case 'Expiring Rewards':
        setExpiringRewardsData([]);
        setSearchTerm('');
        setExpiringRewardsPageIndex(1);
        setExpiringRewardsTotal(Number.MAX_VALUE);
        fetchExpiredRewards(true, filterTerm, searchTerm, reset, 1);
        break;
      default:
        break;
    }
  };

  const fetchAvailableRewards = async (
    showLoader = true,
    filterText = filterTerm,
    searchText = searchTerm,
    reset = false,
    pageIndex: number = availableRewardsPageIndex,
  ) => {
    if (showLoader) {
      setIsLoading(true);
    }
    setIsError(null);
    setFetchMoreAR(true);

    try {
      const memberId: any = await StorageService.getData(userMemberId);
      const pagination = {start: pageIndex, rows: pageSize};
      const rewardType = 'static_coupon';
      const categoryId = '';

      const contents = await getMemberReawardList(
        memberId,
        pagination,
        filterText,
        searchText,
        rewardType,
        categoryId,
      );

      if (contents?.data?.users_getMemberRewardList?.rewardList) {
        const newData = contents?.data?.users_getMemberRewardList?.rewardList;
        setAvailableRewards(prevData =>
          reset ? newData : [...prevData, ...newData],
        );
        setAvailableRewardsPageIndex(prevIndex => prevIndex + 1);

        const total = contents?.data?.users_getMemberRewardList?.total.filtered;
        if (total !== undefined && total !== null) {
          setAvailableTotal(total);
        }
      } else {
        setIsError('Something went wrong!');
      }
    } catch (error: any) {
      setIsError(error.message);
    } finally {
      setIsLoading(false);
      setFetchMoreAR(false);
    }
  };

  const fetchMyRewards = async (
    showLoader = true,
    filterText = filterTerm,
    searchText = searchTerm,
    reset = false,
    pageIndex: number = myRewardsPageIndex,
  ) => {
    if (showLoader) {
      setIsLoading(true);
    }
    setIsError(null);
    setFetchMoreMR(true);

    try {
      const memberId: any = await StorageService.getData(userMemberId);
      const pagination = {start: pageIndex, rows: pageSize};
      const rewardType = 'static_coupon';
      const categoryId = '';

      const contents = await getMemberIssuedReawardList(
        memberId,
        pagination,
        filterText,
        searchText,
        'issued',
        rewardType,
        categoryId,
      );

      if (contents?.data?.users_getMemberIssuedRewardList?.rewardList) {
        const newData =
          contents?.data?.users_getMemberIssuedRewardList?.rewardList;
        setMyRewardsData(prevData =>
          reset ? newData : [...prevData, ...newData],
        );
        setMyRewardsPageIndex(prevIndex => prevIndex + 1);

        const total =
          contents?.data?.users_getMemberIssuedRewardList?.total?.filtered;
        if (total !== undefined && total !== null) {
          setMyRewardsTotal(total);
        }
      } else {
        setIsError('Something went wrong!');
      }
    } catch (error: any) {
      setIsError(error.message);
    } finally {
      setIsLoading(false);
      setFetchMoreMR(false);
    }
  };

  const fetchUsedRewards = async (
    showLoader = true,
    filterText = filterTerm,
    searchText = searchTerm,
    reset = false,
    pageIndex: number = usedRewardsPageIndex,
  ) => {
    if (showLoader) {
      setIsLoading(true);
    }
    setIsError(null);
    setFetchMoreUR(true);

    try {
      const memberId: any = await StorageService.getData(userMemberId);
      const pagination = {start: pageIndex, rows: pageSize};
      const rewardType = 'static_coupon';
      const categoryId = '';

      const contents = await getMemberIssuedReawardList(
        memberId,
        pagination,
        filterText,
        searchText,
        'completed',
        rewardType,
        categoryId,
      );

      if (contents?.data?.users_getMemberIssuedRewardList?.rewardList) {
        const newData =
          contents?.data?.users_getMemberIssuedRewardList?.rewardList;
        setUsedRewardsData(prevData =>
          reset ? newData : [...prevData, ...newData],
        );
        setUsedRewardsPageIndex(prevIndex => prevIndex + 1);

        const total =
          contents?.data?.users_getMemberIssuedRewardList?.total?.filtered;
        if (total !== undefined && total !== null) {
          setUsedRewardsTotal(total);
        }
      } else {
        setIsError('Something went wrong!');
      }
    } catch (error: any) {
      setIsError(error.message);
    } finally {
      setIsLoading(false);
      setFetchMoreUR(false);
    }
  };

  const fetchExpiredRewards = async (
    showLoader = true,
    filterText = filterTerm,
    searchText = searchTerm,
    reset = false,
    pageIndex: number = expiringRewardsPageIndex,
  ) => {
    if (showLoader) {
      setIsLoading(true);
    }
    setIsError(null);
    setFetchER(true);

    try {
      const memberId: any = await StorageService.getData(userMemberId);
      const pagination = {start: pageIndex, rows: pageSize};

      const contents = await getExpiredReawardList(
        memberId,
        pagination,
        filterText,
        searchText,
      );

      if (contents?.data?.users_pointsToExpire?.pointsList) {
        const newData = contents?.data?.users_pointsToExpire?.pointsList;
        setExpiringRewardsData(prevData =>
          reset ? newData : [...prevData, ...newData],
        );
        setExpiringRewardsPageIndex(prevIndex => prevIndex + 1);

        const total = contents?.data?.users_pointsToExpire?.total?.filtered;
        if (total !== undefined && total !== null) {
          setExpiringRewardsTotal(total);
        }
      } else {
        setIsError('Something went wrong!');
      }
    } catch (error: any) {
      setIsError(error.message);
    } finally {
      setIsLoading(false);
      setFetchER(false);
    }
  };

  const getCurrentRewardsData = () => {
    switch (selectValue) {
      case 'Available Rewards':
        return availableRewards;
      case 'My Rewards':
        return myRewardsData;
      case 'Used Rewards':
        return usedRewardsData;
      case 'Expiring Rewards':
        return expiringRewardsData;
      default:
        return [];
    }
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    switch (selectValue) {
      case 'Available Rewards':
        return <AvailableRewardsItem data={item} index={index} />;
      case 'My Rewards':
        return <MyRewardsItem data={item} index={index} />;
      case 'Used Rewards':
        return <MyRewardsItem data={item} index={index} usedReward={true} />;
      case 'Expiring Rewards':
        return <ExpiringRewardsItem data={item} index={index} />;
      default:
        return null;
    }
  };

  const updateData = () => {
    switch (selectValue) {
      case 'Available Rewards':
        if (availableRewards.length < availableTotal && !fetchMoreAR) {
          fetchAvailableRewards(
            false,
            filterTerm,
            searchTerm,
            false,
            availableRewardsPageIndex,
          );
        }
        break;
      case 'My Rewards':
        if (myRewardsData.length < myRewardsTotal && !fetchMoreMR) {
          fetchMyRewards(
            false,
            filterTerm,
            searchTerm,
            false,
            myRewardsPageIndex,
          );
        }
        break;
      case 'Used Rewards':
        if (usedRewardsData.length < usedRewardsTotal && !fetchMoreUR) {
          fetchUsedRewards(
            false,
            filterTerm,
            searchTerm,
            false,
            usedRewardsPageIndex,
          );
        }
        break;
      case 'Expiring Rewards':
        if (expiringRewardsData.length < expiringRewardsTotal && !fetchMoreER) {
          fetchExpiredRewards(
            false,
            filterTerm,
            searchTerm,
            false,
            expiringRewardsPageIndex,
          );
        }
        break;
      default:
        break;
    }
  };

  const handleRetry = () => {
    resetDataAndFetch(true);
  };

  const FilterComponent = () => {
    return (
      <View>
        {filterData.map((item: any) => (
          <TouchableOpacity
            activeOpacity={1}
            key={item.id}
            onPress={() => handleFilterSearch(item.id, item.value)}>
            <Text
              style={[
                styles.filterText,
                item.id === filterId && {
                  color: appConfigData?.secondary_text_color,
                },
              ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const getListFooterComponent = () => {
    switch (selectValue) {
      case 'Available Rewards':
        return fetchMoreAR ? (
          <View style={styles.loading}>
            <ActivityIndicator size="small" />
          </View>
        ) : null;
      case 'My Rewards':
        return fetchMoreMR ? (
          <View style={styles.loading}>
            <ActivityIndicator size="small" />
          </View>
        ) : null;
      case 'Used Rewards':
        return fetchMoreUR ? (
          <View style={styles.loading}>
            <ActivityIndicator size="small" />
          </View>
        ) : null;
      case 'Expiring Rewards':
        return fetchMoreER ? (
          <View style={styles.loading}>
            <ActivityIndicator size="small" />
          </View>
        ) : null;
      default:
        return null;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 1,
      backgroundColor: appConfigData?.background_color,
    },
    searchBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: theme.cardMargin.left,
      marginVertical: theme.cardPadding.carMargin,
      zIndex: 100,
    },
    searchBar: {
      height: 50,
      width: '90%',
      paddingRight: theme.cardPadding.xLargeSize,
      paddingLeft: 56,
      fontFamily: theme.fonts.Inter.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
      borderWidth: theme.border.borderWidth,
      borderColor: theme.colors.grayScale4,
      borderRadius: theme.border.borderRadius,
    },
    searchIcon: {
      position: 'absolute',
      left: theme.cardPadding.mediumSize,
      alignSelf: 'center',
    },
    crossIcon: {
      position: 'absolute',
      right: 50,
      alignSelf: 'center',
    },
    dropDownContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.cardPadding.mediumSize,
      marginHorizontal: theme.cardMargin.left,
      marginVertical: theme.cardPadding.mediumSize,
      alignItems: 'center',
      zIndex: 100,
    },
    dropDown: {
      borderWidth: theme.border.borderWidth,
      borderColor: theme.colors.grayScale4,
      borderRadius: theme.border.borderRadius,
      paddingHorizontal: theme.cardPadding.mediumSize,
      height: 50,
    },
    filterContainer: {
      position: 'absolute',
      right: 15,
      top: 135,
      width: 160,
      backgroundColor: appConfigData?.background_color,
      borderWidth: theme.border.borderWidth,
      borderColor: theme.colors.grayScale4,
      borderRadius: theme.border.borderRadius,
      paddingHorizontal: theme.cardPadding.carMargin,
    },
    filterText: {
      fontFamily: theme.fonts.HCLTechRoobert.medium,
      fontSize: theme.fontSize.font16,
      color: theme.colors.lightGray,
      paddingVertical: 8,
    },
    textStyle: {
      fontFamily: theme.fonts.Inter.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
    },
    listContainer: {
      paddingHorizontal: theme.cardPadding.mediumSize,
      paddingVertical: 8,
    },
    icon: {
      height: 20,
      width: 20,
      alignSelf: 'center',
    },
    flatListView: {
      flexGrow: 1,
      alignItems: 'center',
      gap: theme.cardPadding.mediumSize,
      paddingBottom: theme.cardPadding.mediumSize,
      zIndex: -1,
    },
    loading: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    filterApplied: {
      height: 8,
      width: 8,
      borderRadius: 4,
      backgroundColor: appConfigData?.primary_color,
      position: 'absolute',
      right: 0,
      top: -5,
    },
  });

  return (
    <>
      <DefaultHeader header="Rewards Management" />
      <View style={styles.container}>
        {isSearchBarVisible ? (
          <View style={styles.searchBarContainer}>
            <TextInput
              ref={searchInputRef}
              style={styles.searchBar}
              placeholder="Search here"
              placeholderTextColor={theme.colors.lightGray}
              value={searchTerm}
              onChangeText={handleSearch}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
              maxLength={20}
            />
            <TouchableOpacity
              activeOpacity={1}
              onPress={handleSearchCancel}
              style={styles.crossIcon}>
              <Image
                source={icons.cross}
                tintColor={appConfigData?.secondary_text_color}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={handleSearchSubmit}
              style={styles.searchIcon}>
              <Image source={icons.search} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsFilterVisible(!isFilterVisible)}>
              {filterApplied && <View style={styles.filterApplied}></View>}
              <Image source={icons.ListIcon} style={styles.icon} />
            </TouchableOpacity>
            {isFilterVisible && <FilterComponent />}
          </View>
        ) : (
          <View style={styles.dropDownContainer}>
            <DropDownPicker
              open={dropDownOpen}
              value={rewardValue}
              items={rewards}
              setOpen={setDropDownOpen}
              placeholder="ALL"
              setValue={setRewardValue}
              onSelectItem={handleDropdownChange}
              zIndex={2000}
              zIndexInverse={1000}
              listMode="SCROLLVIEW"
              style={styles.dropDown}
              textStyle={styles.textStyle}
              containerStyle={{width: dropdownWidth}}
              dropDownDirection={'BOTTOM'}
              dropDownContainerStyle={{borderColor: theme.colors.grayScale4}}
              labelProps={{
                numberOfLines: 1,
                ellipsizeMode: 'tail',
              }}
              renderListItem={(item: any) => (
                <TouchableOpacity
                  style={styles.listContainer}
                  activeOpacity={1}
                  onPress={() => {
                    setRewardValue(item.value);
                    handleDropdownChange(item);
                    setDropDownOpen(false);
                  }}>
                  <Text style={styles.textStyle} numberOfLines={1}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <>
              <TouchableOpacity onPress={() => setIsSearchBarVisible(true)}>
                <Image source={icons.search} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  setIsFilterVisible(!isFilterVisible);
                }}>
                {filterApplied && <View style={styles.filterApplied}></View>}
                <Image source={icons.ListIcon} style={styles.icon} />
              </TouchableOpacity>
            </>
            {isFilterVisible && (
              <Modal
                transparent={true}
                animationType="none"
                visible={isFilterVisible}
                onRequestClose={() => setIsFilterVisible(false)}>
                <TouchableWithoutFeedback
                  onPress={() => setIsFilterVisible(false)}>
                  <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                      <View style={styles.filterContainer}>
                        <FilterComponent />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            )}
          </View>
        )}

        {isLoading ? (
          <LoadingScreen
            isLoading={isLoading}
            error={isError}
            onRetry={handleRetry}
          />
        ) : getCurrentRewardsData().length > 0 ? (
          <FlatList
            contentContainerStyle={styles.flatListView}
            data={getCurrentRewardsData()}
            renderItem={renderItem}
            onEndReached={updateData}
            onEndReachedThreshold={0.5}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={getListFooterComponent()}
          />
        ) : (
          getCurrentRewardsData().length === 0 && <NoDataScreen reward={true} />
        )}
      </View>
    </>
  );
};

export default RewardManagement;
