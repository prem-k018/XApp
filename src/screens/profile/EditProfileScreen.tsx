import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';
import DefaultHeader from '@app/components/ui-components/defaultHeader';
import {icons} from '@app/assets/icons';
import {images} from '@app/assets/images';
import ScreenNames from '@app/constants/screenNames';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import screensUtils from '@app/utils/screensUtils';
import {
  countries,
  genderData,
  LanguageList,
} from '@app/constants/helperConstants';
import {loadImageByAddingBaseUrl} from '@app/utils/imageLinkUtils';
import {UserProfile} from '@app/model/profile/userProfile';
import updateUserProfile from '@app/services/profile/updateUserProfile';
import LoadingScreen from '../loadingScreen/loadingScreen';
import {userInfo, view} from '@app/constants/constants';
import {addEventForTracking} from '@app/services/tracking/rpiServices';
import StatusPopup from '@app/components/Popup/StatusPopup';
import StorageService from '@app/utils/storageService';
import getUserProfileData from '@app/services/profile/userProfileService';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

export type Props = {
  route: any;
};

const EditProfileScreen: React.FC<Props> = ({route}) => {
  const {appConfigData} = useAppContext();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {data} = route.params;
  const userData: UserProfile = data?.data?.publish_viewProfile;

  const isValidDate = (date: any) => {
    return date instanceof Date && !isNaN(date as any);
  };

  const initialDob = userData?.dob ? new Date(userData.dob) : '';

  const [firstName, setFirstName] = useState<string>(userData?.first_name);
  const [lastName, setLastName] = useState<string>(userData?.last_name);
  const [gender, setGender] = useState<string>(userData?.gender);
  const [genderDropDownOpen, setGenderDropDownOpen] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState('');
  const [countryDropOpen, setCountryDropOpen] = useState<boolean>(false);
  const [mobileNo, setMobileNo] = useState<string>(userData?.phone);
  const [dob, setDob] = useState<Date | any>(
    initialDob && isValidDate(initialDob) ? initialDob : '',
  );
  const [dobOpen, setDobOpen] = useState<boolean>(false);
  const [langDropDownOpen, setLangDropDownOpen] = useState<boolean>(false);
  const [lang, setLang] = useState<string>('en');
  const [langData, setLangData] = useState<any>([]);
  const [updateProfileResponse, setUpdateProfileResponse] = useState();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [validUrl, setValidUrl] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<any>();

  useEffect(() => {
    const appViewTracking = async () => {
      const data = {
        ContentType: ScreenNames.editProfileScreen,
        screenType: view,
      };
      await addEventForTracking(data);
    };
    appViewTracking();
  }, []);

  useEffect(() => {
    if (userData?.dob) {
      const parsedDate = new Date(userData.dob);
      if (isValidDate(parsedDate)) {
        setDob(parsedDate);
      } else {
        setDob('');
      }
    } else {
      setDob('');
    }
  }, [userData?.dob]);

  const screenWidth = screensUtils.screenWidth;
  const containerWidth = screenWidth - (28.5 + 28.5);

  const uniqueCountries = Array.from(
    new Set(countries.map(item => item.label)),
  ).map(label => countries.find(item => item.label === label));

  const countriesData = uniqueCountries.map((item: any) => ({
    label: item?.label,
    value: item?.label,
    key: item.value,
  }));

  useEffect(() => {
    const languageData = LanguageList.map((item: any) => {
      let language = (
        <View style={styles.itemContainer}>
          <Image source={{uri: item.flagIcon}} style={styles.flagIcon} />
          <Text style={styles.textStyle}>{item.label}</Text>
        </View>
      );
      return {label: language, value: item.value};
    });
    setLangData(languageData as any);
  }, []);

  useEffect(() => {
    if (userData?.phone) {
      const parts = userData.phone.split('-');

      let countryCode = parts[0];
      let mobileNo = parts.slice(1).join('-');

      if (parts.length > 2 && parts[1].length === 3 && parts[2].length > 3) {
        countryCode = `${parts[0]}-${parts[1]}`;
        mobileNo = parts.slice(2).join('-');
      }
      setCountryCode(countryCode);
      setMobileNo(mobileNo);
    }
  }, []);

  const userDetails: UserProfile | any = {
    id: userData.user_id,
    first_name: firstName.trimEnd().trimStart(),
    last_name: lastName.trimEnd().trimStart(),
    preferred_sites_languages: lang,
    phone: countryCode + '-' + mobileNo.trimEnd().trimStart(),
    gender: gender,
    dob: dob,
    enabled: true,
    default_site: null,
    accessible_sites: null,
    preferred_sites_urls: null,
  };

  async function getUserData(userId: string) {
    try {
      const contents = await getUserProfileData(userId as string);
      if ('data' in contents && contents?.data?.publish_viewProfile) {
        await StorageService.clearData(userInfo);
        await StorageService.storeData(userInfo, JSON.stringify(contents));
      } else {
        setIsError('Something went wrong!!!!'); // Set the error message
      }
    } catch (err: any) {
      console.log(err.message);
    }
  }

  const handleUpdateProfile = async (options: {showLoader: boolean}) => {
    const {showLoader} = options;
    setIsLoading(true);

    try {
      if (showLoader) {
        setIsError(null);
        setIsLoading(true);
      }
      const contents = await updateUserProfile(userDetails);
      if ('data' in contents && contents?.data?.publish_updateUserProfile) {
        setUpdateProfileResponse(
          contents?.data?.publish_updateUserProfile?.message,
        );
        console.log(contents?.data?.publish_updateUserProfile?.message);
        setMessage({
          topic: 'Profile Update Status',
          message: contents.data?.publish_updateUserProfile?.message,
          status: 'success',
        });
        getUserData(userData.user_id);
        setIsLoading(false);
      } else {
        setMessage({
          topic: 'Profile Update Status',
          message: contents.data?.publish_updateUserProfile?.message,
          status: 'failed',
        });
        setIsError('Something went wrong!!!!'); // Set the error message
        setIsLoading(false);
      }
    } catch (err: any) {
      setMessage({
        topic: 'Profile Update Status',
        message: err.message,
        status: 'fail',
      });
      console.log(err.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      setVisible(true);
      console.log('Updated User Details: ', userDetails);
    }
  };

  const profileImage = loadImageByAddingBaseUrl(userData.image);
  if (userData.image !== '') {
    const isValidImageUrl = async (profileImage: string) => {
      return Image.prefetch(profileImage)
        .then(() => {
          setValidUrl(true);
        })
        .catch(() => setValidUrl(false));
    };
    isValidImageUrl(profileImage);
  }

  const handleRetry = () => {
    handleUpdateProfile({showLoader: true});
  };

  const handleStatusClose = () => {
    if (message.status === 'success') {
      setVisible(false);
      navigation.goBack();
    } else {
      setVisible(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingHorizontal: theme.cardMargin.left,
      paddingVertical: theme.cardPadding.carMargin,
      backgroundColor: appConfigData?.background_color,
      gap: 24,
    },
    profileImage: {
      height: 98,
      width: 98,
      borderRadius: 98 / 2,
      alignSelf: 'center',
      borderWidth: theme.border.borderWidth,
      borderColor: appConfigData?.primary_color,
    },
    editIconContainer: {
      height: 27,
      width: 27,
      borderRadius: 27 / 2,
      position: 'absolute',
      bottom: -1,
      right: '38%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: appConfigData?.primary_color,
      alignSelf: 'center',
    },
    editIcon: {
      height: 16,
      width: 16,
      tintColor: appConfigData?.primary_text_color,
    },
    inputContainer: {
      gap: 6,
    },
    title: {
      fontFamily: theme.fonts.Inter.regular,
      fontSize: theme.fontSize.font12,
      color: theme.colors.lightGray,
    },
    textStyle: {
      fontFamily: theme.fonts.Inter.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
    },
    input: {
      width: '100%',
      height: 62,
      paddingHorizontal: theme.cardPadding.mediumSize,
      paddingVertical: theme.cardPadding.mediumSize,
      borderWidth: theme.border.borderWidth,
      borderRadius: theme.border.borderRadius,
      borderColor: appConfigData?.secondary_text_color,
      color: theme.colors.primaryBlack,
    },
    inputNonEditable: {
      width: '100%',
      paddingHorizontal: theme.cardPadding.mediumSize,
      paddingVertical: 17,
      borderWidth: theme.border.borderWidth,
      borderRadius: theme.border.borderRadius,
      borderColor: theme.colors.grayScale4,
      color: theme.colors.Grayscale,
      backgroundColor: '#F7F7FC',
    },
    dropDownMenu: {
      borderRadius: theme.border.borderRadius,
      width: '100%',
      height: 62,
      paddingHorizontal: theme.cardPadding.mediumSize,
    },
    flagIcon: {
      width: 28,
      height: 18,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.cardPadding.smallXsize,
      gap: theme.cardPadding.defaultPadding,
    },
    calenderIcon: {
      height: 18,
      width: 16,
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    datePickerCard: {
      width: containerWidth,
      backgroundColor: appConfigData?.background_color,
      paddingTop: 36,
      paddingBottom: theme.cardPadding.largeSize,
      paddingHorizontal: 24,
      alignItems: 'center',
      gap: theme.cardPadding.mediumSize,
      borderRadius: theme.border.borderRadius,
    },
    doneButton: {
      padding: theme.cardPadding.defaultPadding,
      alignSelf: 'center',
      backgroundColor: appConfigData?.primary_color,
      borderRadius: theme.border.borderRadius,
    },
    searchBar: {
      height: 50,
      width: '90%',
      paddingHorizontal: theme.cardPadding.mediumSize,
      fontFamily: theme.fonts.Inter.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
      borderWidth: theme.border.borderWidth,
      borderColor: theme.colors.lightGray,
      borderRadius: theme.border.borderRadius,
    },
  });

  return isLoading ? (
    <>
      <DefaultHeader
        header="My Profile"
        icon1={icons.checkMark}
        tintColor={appConfigData?.secondary_text_color}
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
        header="My Profile"
        icon1={icons.checkMark}
        tintColor={appConfigData?.secondary_text_color}
        onPressIcon1={() => handleUpdateProfile({showLoader: true})}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        contentContainerStyle={styles.container}>
        <View>
          {visible && (
            <StatusPopup
              data={message}
              visible={visible}
              onClose={handleStatusClose}
              isLoading={isLoading}
            />
          )}
          <Image
            source={
              validUrl
                ? {uri: profileImage}
                : userData?.gender?.toLowerCase() === 'female'
                ? images.femaleProfileAvatar
                : images.profileAvatar
            }
            style={styles.profileImage}
            resizeMode="contain"
          />
          {/* <View style={styles.editIconContainer}>
            <Image source={icons.edit} style={styles.editIcon} />
          </View> */}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.title}>First Name</Text>
          <TextInput
            id="First Name"
            style={styles.input}
            onChangeText={setFirstName}
            value={firstName}
            placeholder={'Enter Your First Name'}
            placeholderTextColor={theme.colors.lightGray}
            maxLength={20}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Last Name</Text>
          <TextInput
            id="Last Name"
            style={styles.input}
            onChangeText={setLastName}
            value={lastName}
            placeholder={'Enter Your Last Name'}
            placeholderTextColor={theme.colors.lightGray}
            maxLength={20}
          />
        </View>
        <View style={[styles.inputContainer, {zIndex: 1}]}>
          <Text style={styles.title}>Gender</Text>
          <DropDownPicker
            open={genderDropDownOpen}
            value={gender}
            items={genderData}
            setOpen={setGenderDropDownOpen}
            placeholder={'Gender'}
            setValue={setGender}
            zIndex={2000}
            zIndexInverse={1000}
            style={styles.dropDownMenu}
            listMode="SCROLLVIEW"
            textStyle={styles.textStyle}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Email Address</Text>
          <TextInput
            id="Email Address"
            style={styles.inputNonEditable}
            value={userData?.email}
            editable={false}
            placeholder={'Enter Your Email Address'}
            placeholderTextColor={theme.colors.lightGray}
          />
        </View>
        <View style={[styles.inputContainer, {zIndex: 1000}]}>
          <Text style={styles.title}>Language</Text>
          <DropDownPicker
            open={langDropDownOpen}
            value={lang}
            items={langData}
            setOpen={setLangDropDownOpen}
            setValue={setLang}
            placeholder={'Select Language'}
            style={[styles.dropDownMenu, {paddingHorizontal: 12}]}
            listMode="SCROLLVIEW"
            textStyle={styles.textStyle}
            dropDownContainerStyle={{
              minHeight: 62,
              paddingTop: 8,
              borderRadius: theme.border.borderRadius,
            }}
          />
        </View>
        <View style={{flexDirection: 'row', gap: 13}}>
          <View style={[styles.inputContainer, {zIndex: 1}]}>
            <Text style={styles.title}>Country Code</Text>
            <DropDownPicker
              open={countryDropOpen}
              value={countryCode}
              items={countriesData}
              setOpen={setCountryDropOpen}
              setValue={setCountryCode}
              placeholder={'ISD'}
              zIndex={3000}
              zIndexInverse={2000}
              maxHeight={200}
              listMode="MODAL"
              dropDownDirection="BOTTOM"
              modalAnimationType="slide"
              style={[styles.dropDownMenu, {width: 115, paddingHorizontal: 10}]}
              textStyle={styles.textStyle}
              searchable={true}
              searchPlaceholder="Search for country code"
              searchTextInputStyle={styles.searchBar}
            />
          </View>
          <View style={{flex: 1}}>
            <View style={styles.inputContainer}>
              <Text style={styles.title}>Mobile Number</Text>
              <TextInput
                id="Mobile Number"
                style={styles.input}
                onChangeText={setMobileNo}
                value={mobileNo}
                placeholder={'Enter Mobile No'}
                placeholderTextColor={theme.colors.lightGray}
                keyboardType="numeric"
                maxLength={20}
              />
            </View>
          </View>
        </View>
        <View style={[styles.inputContainer, {zIndex: -1}]}>
          <Text style={styles.title}>Date of birth</Text>
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.input,
              {flexDirection: 'row', justifyContent: 'space-between'},
            ]}
            onPress={() => setDobOpen(true)}>
            <Text style={styles.textStyle}>
              {dob ? dob?.toLocaleDateString('en-GB') : 'DD/MM/YYYY'}
            </Text>
            <Image source={icons.calenderIcon} style={styles.calenderIcon} />
          </TouchableOpacity>
        </View>
        <Modal visible={dobOpen} transparent animationType="slide">
          <View style={styles.modalBackground}>
            <View style={styles.datePickerCard}>
              <DatePicker
                date={dob || new Date()}
                theme="light"
                mode="date"
                onDateChange={setDob}
                maximumDate={new Date()}
              />
              <TouchableOpacity
                activeOpacity={1}
                style={styles.doneButton}
                onPress={() => setDobOpen(false)}>
                <Text
                  style={[
                    styles.textStyle,
                    {color: appConfigData?.primary_text_color},
                  ]}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={[styles.inputContainer, {zIndex: -1}]}>
          <Text style={styles.title}>Membership Id</Text>
          <TextInput
            id="Membership Id"
            style={styles.inputNonEditable}
            value={userData?.member_id}
            multiline
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Loyalty Card no</Text>
          <TextInput
            id="Loyalty Card no"
            style={styles.inputNonEditable}
            value={userData?.loyalty_card_number}
            editable={false}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default EditProfileScreen;
