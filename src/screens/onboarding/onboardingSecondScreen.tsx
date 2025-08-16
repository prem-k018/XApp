/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Pressable,
  SafeAreaView,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {useState} from 'react';
import {icons} from '@app/assets/icons';
import {tabNames, theme} from '@app/constants';
import {TagResponse} from '@app/model/tagList';
import getTagListData from '@app/services/tagListService';
import LoadingScreen from '../loadingScreen/loadingScreen';
import StorageService from '@app/utils/storageService';
import {
  isOnboardingShown,
  refreshScreenData,
  storedUserID,
  tagListArray,
} from '@app/constants/constants';
import {EventRegister} from 'react-native-event-listeners';
import {useTranslation} from 'react-i18next';
import {useAppContext} from '@app/store/appContext';
import {sessionTimeout} from '@app/constants/errorCodes';
import {createVisitorData} from '@app/services/tracking/rpiServices';

const OnboardingSecondScreen: React.FC = ({route}: any) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [data, setData] = useState<(TagResponse | any)[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const {searchTerm} = route.params || {};
  const {t} = useTranslation();
  const {geoLocationData, userInfo, appConfigData} = useAppContext();

  useEffect(() => {
    const loadSelectedItems = async () => {
      try {
        const storedSelectedItemsText = await StorageService.getData(
          tagListArray,
        );
        console.log('Stored Selected Items ======> ', storedSelectedItemsText);
        if (storedSelectedItemsText) {
          const storedSelectedItems = JSON.parse(storedSelectedItemsText);
          setSelectedItems(storedSelectedItems);
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };
    loadSelectedItems();
    getData({showLoader: true});
  }, []);

  async function getData(options: {showLoader: boolean}) {
    const {showLoader} = options;

    try {
      if (showLoader) {
        setIsLoading(true); // Show loading indicator
        setIsError(null); // Reset the error message
      }

      const pagination = {start: 0, rows: 100};
      const sort = 'DESC';

      // Call the fetchGraphQLData function with input parameters
      const contents = await getTagListData(pagination, sort);

      if ('data' in contents && contents.data.publish_getTagsList) {
        const newData = contents?.data.publish_getTagsList;
        const newArray = newData.map((item, index) => ({
          id: index + 1,
          text: item,
        }));

        setData(newArray);
        setIsLoading(false); // Hide loading indicator when the service call is complete
      } else {
        setIsError('Something went wrong!!!!'); // Set the error message
      }
    } catch (err: any) {
      console.log(err.message);
      if (err.message !== `${sessionTimeout}`) {
        setIsError('Something went wrong!!!!'); // Set the error message
      }
    }
  }

  const toggleItem = (itemText: any) => {
    if (selectedItems.includes(itemText)) {
      setSelectedItems(selectedItems.filter((text: any) => text !== itemText));
    } else {
      setSelectedItems([...selectedItems, itemText]);
    }
  };

  const handleLogSelectedItems = async () => {
    const selectedItemsText: Array<any> = [];
    selectedItems.forEach((itemText: any) => {
      const selectedItem = data.find(item => item.text === itemText);
      if (selectedItem) {
        selectedItemsText.push(selectedItem.text);
      }
    });

    console.log('Selected Items: ', selectedItemsText);
    await StorageService.clearData(tagListArray);
    await StorageService.storeData(
      tagListArray,
      JSON.stringify(selectedItemsText),
    );
    await StorageService.storeData(isOnboardingShown, 'true');
    await createVisitorID();
    EventRegister.emit(refreshScreenData);
    navigation?.goBack();
  };

  async function createVisitorID() {
    setIsLoading(true);

    const userID = await StorageService.getData(storedUserID);
    const storedSelectedItemsText = await StorageService.getData(tagListArray);

    let tagList: string = '';

    if (storedSelectedItemsText) {
      const storedTagList = JSON.parse(storedSelectedItemsText);
      tagList = storedTagList.join(',');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const content = await createVisitorData(
      userID ?? '',
      tagList,
      geoLocationData,
      userInfo?.data,
    );
    setIsLoading(false);
  }

  const handleRetry = () => {
    getData({showLoader: true});
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    text: {
      color: theme.colors.fullBlack,
      fontSize: theme.fontSize.font36,
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      marginTop: 30,
      marginLeft: 20,
      marginRight: theme.cardMargin.right,
    },
    flatListItem: {
      flex: 1,
      marginLeft: 20,
      marginRight: theme.cardMargin.right,
      marginTop: theme.cardMargin.top,
    },
    scrollViewContent: {
      flexWrap: 'wrap',
      flexDirection: 'row',
    },
    item: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      marginRight: 12,
      marginBottom: 12,
      borderWidth: theme.border.borderWidth,
      borderColor: theme.colors.fullBlack,
      borderRadius: theme.border.borderRadius,
    },
    itemText: {
      fontFamily: theme.fonts.Inter.regular,
      fontSize: theme.fontSize.font18,
    },
    button: {
      backgroundColor: theme.colors.fullBlack,
      borderRadius: theme.border.borderRadius,
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    buttondone: {
      backgroundColor: theme.colors.fullBlack,
      borderRadius: theme.border.borderRadius,
      paddingHorizontal: 36,
      paddingVertical: 12,
    },
    doneButton: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 14,
      marginBottom: 20,
    },
    doneButtonText: {
      color: theme.colors.white,
      fontFamily: theme.fonts.HCLTechRoobert.semiBold,
      fontSize: theme.fontSize.font16,
    },
    buttonText: {
      color: theme.colors.white,
      fontFamily: theme.fonts.HCLTechRoobert.semiBold,
      fontSize: theme.fontSize.font16,
      paddingRight: 12,
    },
    buttonView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    buttonIcon: {
      flexShrink: 0,
      height: 20,
      width: 20,
    },
    lowerContent: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginLeft: 20,
      marginRight: theme.cardMargin.right,
      marginTop: 14,
      marginBottom: 20,
    },
  });

  return isLoading ? (
    <LoadingScreen
      isLoading={isLoading}
      error={isError}
      onRetry={handleRetry}
    />
  ) : (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.text}>{t('onboardingSecondScreen.title')}</Text>
        <View style={styles.flatListItem}>
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            bounces={false}>
            {data.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => toggleItem(item.text)}
                style={[
                  styles.item,
                  {
                    backgroundColor: selectedItems.includes(item.text)
                      ? theme.colors.fullBlack
                      : theme.colors.primaryWhite,
                  },
                ]}>
                <Text
                  style={[
                    {
                      color: selectedItems.includes(item.text)
                        ? appConfigData?.primary_text_color
                        : appConfigData?.secondary_text_color,
                    },
                    styles.itemText,
                  ]}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {!searchTerm && (
          <View style={styles.lowerContent}>
            <>
              <Pressable onPress={handleLogSelectedItems}>
                <View style={styles.button}>
                  <View style={styles.buttonView}>
                    <Text style={styles.buttonText}>
                      {t('onboardingSecondScreen.getStarted')}
                    </Text>
                    <Image
                      source={icons.forwardArrow}
                      style={styles.buttonIcon}
                    />
                  </View>
                </View>
              </Pressable>
            </>
          </View>
        )}
        {searchTerm && (
          <Pressable style={styles.doneButton} onPress={handleLogSelectedItems}>
            <View style={styles.buttondone}>
              <Text style={styles.doneButtonText}>
                {t('onboardingSecondScreen.done')}
              </Text>
            </View>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

export default OnboardingSecondScreen;
