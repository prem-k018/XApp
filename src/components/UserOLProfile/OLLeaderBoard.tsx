import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';
import DropDownPicker from 'react-native-dropdown-picker';
import LinearGradient from 'react-native-linear-gradient';
import {capitalizeFirstLetter} from '@app/utils/HelperFunction';
import {LeaderBoardEntry} from '@app/model/openLoyalty/OLLeaderBoardList';
import {Campaign} from '@app/model/openLoyalty/OLCampaignList';
import StorageService from '@app/utils/storageService';
import getOLLeaderBoardList from '@app/services/openLoyalty/OLLeaderBoardList';
import {userEmail} from '@app/constants/constants';

export type Props = {
  campaignData: Campaign[];
};

const OLLeaderBoard: React.FC<Props> = ({campaignData}) => {
  const filterEvent = campaignData.filter(
    (item: Campaign) => item.campaignName !== 'Added by admin',
  );
  const {appConfigData} = useAppContext();
  const [leaderData, setLeaderData] = useState<LeaderBoardEntry[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [userEmailId, setUserEmailId] = useState<string>('');
  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
  const [eventValue, setEventValue] = useState<string>(
    filterEvent[0]?.campaignId,
  );

  const currentMonth = new Date().toLocaleString('default', {month: 'short'});

  const events = [
    ...filterEvent.map((item: Campaign) => ({
      label: item?.campaignName,
      value: item?.campaignId,
    })),
  ];

  const onEventOPen = useCallback(() => {}, []);

  useEffect(() => {
    async function fetchUserEmail() {
      const email = await StorageService.getData(userEmail);
      setUserEmailId(email as string);
    }
    fetchUserEmail();
    getOLLeaderBoardData({campaignId: eventValue ?? '', showLoader: true});
  }, []);

  async function getOLLeaderBoardData({showLoader, campaignId}: any) {
    setIsLoading(showLoader);
    setIsError(null);

    try {
      if (showLoader) {
        setIsError(null);
        setIsLoading(true);
      }
      const contents = await getOLLeaderBoardList(campaignId, userEmailId);
      if ('data' in contents && contents?.data?.users_getLeaderBoardList) {
        setLeaderData(contents?.data?.users_getLeaderBoardList);
        setIsLoading(false);
      } else {
        setIsError('Something went wrong!!!!'); // Set the error message
        setIsLoading(false);
      }
    } catch (err: any) {
      console.log(err.message);
      setIsError('Something went wrong!');
      setIsLoading(false);
    }
  }

  const handleDropdownChange = (item: any) => {
    setEventValue(item?.value);
    getOLLeaderBoardData({campaignId: item?.value, showLoader: true});
  };

  const getRankByEmail = (email: string) => {
    const user = leaderData?.find((item: any) => item.email === email);
    return user ? user.rank : 0;
  };

  const rank = getRankByEmail(userEmailId);

  const LeaderBoardItem = ({item, index}: any) => {
    const colors = [
      ['#F2D878', '#D7A347'],
      ['#546269', '#B5BDC1'],
      ['#B05A3B', '#D59978'],
      ['#EFF0F6', '#EFF0F6'],
    ];

    const backgroundColor = colors[index] || colors[3];
    const textColor =
      index < 3 ? appConfigData?.primary_text_color : theme.colors.lightGray;

    return (
      <View
        style={[
          styles.headingContainer,
          {paddingVertical: theme.cardPadding.smallXsize},
        ]}>
        <View style={styles.leaderBoardContainer}>
          <View style={styles.logo}>
            <Text style={styles.nameLogo}>
              {item?.userName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text numberOfLines={1} style={[styles.userName, {width: '68%'}]}>
            {capitalizeFirstLetter(item?.userName)}
          </Text>
          <Text numberOfLines={1} style={styles.userName}>
            {item?.rank}
          </Text>
        </View>
        <LinearGradient colors={backgroundColor} style={styles.pointContainer}>
          <Text
            style={[styles.pointText, {color: textColor}]}
            numberOfLines={1}>
            {item?.totalPoints}
          </Text>
        </LinearGradient>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      marginHorizontal: theme.cardMargin.left,
      marginVertical: theme.cardPadding.mediumSize,
      gap: theme.cardPadding.carMargin,
    },
    headingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    headingText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.secondary_text_color,
      alignSelf: 'flex-start',
    },
    leaderBoardContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.cardPadding.smallXsize,
      paddingHorizontal: 8,
    },
    logo: {
      height: 38,
      width: 38,
      borderRadius: 38 / 2,
      backgroundColor: theme.colors.grayScale4,
      justifyContent: 'center',
    },
    nameLogo: {
      textAlign: 'center',
      fontSize: theme.fontSize.font18,
      fontFamily: theme.fonts.HCLTechRoobert.bold,
      color: appConfigData?.primary_text_color,
    },
    userName: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.secondary_text_color,
    },
    pointContainer: {
      width: 70,
      height: 25,
      borderRadius: theme.border.borderRadius * 6,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    pointText: {
      fontFamily: theme.fonts.Inter.semiBold,
      fontSize: theme.fontSize.font14,
      textAlign: 'center',
    },
    divider: {
      borderBottomWidth: theme.border.borderWidth,
      borderBottomColor: theme.colors.grayScale4,
    },
    loadingContainer: {
      flex: 1,
      minHeight: 340,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    dropDownMenu: {
      position: 'absolute',
      right: 0,
      top: -10,
      zIndex: 1,
    },
    textStyle: {
      fontFamily: theme.fonts.Inter.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
    },
    listContainer: {
      gap: 5,
      padding: 5,
    },
    noDataText: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
      textAlign: 'center',
      justifyContent: 'center',
      marginVertical: 160,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.headingText}>{currentMonth}. Leaderboard</Text>
        {events[0]?.label && (
          <View style={styles.dropDownMenu}>
            <DropDownPicker
              open={dropDownOpen}
              value={eventValue}
              items={events}
              setOpen={setDropDownOpen}
              placeholder={events[0]?.label || 'No data'}
              onOpen={onEventOPen}
              setValue={setEventValue}
              onSelectItem={handleDropdownChange}
              zIndex={2000}
              zIndexInverse={1000}
              listMode="SCROLLVIEW"
              style={{width: 155, borderRadius: theme.border.borderRadius}}
              containerStyle={{maxHeight: 0}}
              textStyle={styles.textStyle}
              dropDownDirection={'BOTTOM'}
              labelProps={{
                numberOfLines: 1,
                ellipsizeMode: 'tail',
              }}
              renderListItem={(item: any) => (
                <TouchableOpacity
                  style={styles.listContainer}
                  activeOpacity={1}
                  onPress={() => {
                    setEventValue(item.value);
                    handleDropdownChange(item);
                    setDropDownOpen(false);
                  }}>
                  <Text style={styles.textStyle} numberOfLines={1}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={appConfigData?.primary_color}
          />
        </View>
      ) : (
        <View style={{zIndex: -1}}>
          {leaderData?.length !== 0 ? (
            <FlatList
              data={leaderData}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              renderItem={({item, index}) => {
                const gradientColors = [
                  ['#FAF0D100', '#f9f5e6'],
                  ['#cecdcd00', '#D9D9D9'],
                  ['#C7816100', '#f5dace'],
                  ['#FFFFFF', '#FFFFFF'],
                ];
                const itemGradientColors =
                  gradientColors[index] || gradientColors[3];
                return (
                  <LinearGradient
                    colors={itemGradientColors}
                    start={{x: 1, y: 0}}
                    end={{x: 0, y: 0}}>
                    <LeaderBoardItem item={item} index={index} />
                    {index !== (leaderData?.length ?? 0) - 1 && (
                      <View
                        style={[
                          styles.divider,
                          {
                            borderBottomColor:
                              rank > 7 && index === 3 ? '#A0A3BD' : '#EDEDED',
                          },
                        ]}
                      />
                    )}
                  </LinearGradient>
                );
              }}
              nestedScrollEnabled
            />
          ) : (
            <Text style={styles.noDataText}>No data available</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default OLLeaderBoard;
