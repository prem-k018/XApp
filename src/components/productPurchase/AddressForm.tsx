import React, {useRef} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {theme} from '@app/constants';
import {useAppContext} from '@app/store/appContext';

export type Address = {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  landMark: string;
  phoneNumber: string;
};

type Props = {
  address: Address;
  setAddress: (field: keyof Address, value: string) => void;
};

const AddressForm: React.FC<Props> = ({address, setAddress}) => {
  const {appConfigData} = useAppContext();
  const addressRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const stateRef = useRef<TextInput>(null);
  const countryRef = useRef<TextInput>(null);
  const pincodeRef = useRef<TextInput>(null);
  const landMarkRef = useRef<TextInput>(null);
  const phoneNumberRef = useRef<TextInput>(null);

  const styles = StyleSheet.create({
    container: {
      gap: theme.cardPadding.mediumSize,
    },
    title: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: '#838589',
    },
    inputText: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_color,
    },
    input: {
      backgroundColor: '#FAFAFA',
      borderRadius: theme.border.borderRadius,
      paddingHorizontal: 20,
      paddingVertical: theme.cardPadding.defaultPadding,
    },
    bigInput: {
      height: 70,
    },
    countryView: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    city: {
      gap: 20,
      width: '46%',
    },
    country: {
      gap: 20,
      width: '51%',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Name</Text>
      <TextInput
        style={[styles.input, styles.inputText]}
        value={address.name}
        placeholder="Please enter your name here"
        placeholderTextColor={theme.colors.lightGray}
        onChangeText={text => setAddress('name', text)}
        returnKeyType="next"
        onSubmitEditing={() => addressRef.current?.focus()}
        blurOnSubmit={false}
        maxLength={50}
      />
      <Text style={styles.title}>Address</Text>
      <TextInput
        ref={addressRef}
        style={[styles.input, styles.bigInput, styles.inputText]}
        value={address.address}
        onChangeText={text => setAddress('address', text)}
        placeholder="Please enter your address here"
        placeholderTextColor={theme.colors.lightGray}
        multiline
        maxLength={300}
        textAlignVertical="top"
        returnKeyType="next"
        onSubmitEditing={() => cityRef.current?.focus()}
        blurOnSubmit={false}
      />
      <View style={styles.countryView}>
        <View style={styles.city}>
          <Text style={styles.title}>City</Text>
          <TextInput
            ref={cityRef}
            style={[styles.input, styles.inputText]}
            value={address.city}
            placeholder="City"
            placeholderTextColor={theme.colors.lightGray}
            onChangeText={text => setAddress('city', text)}
            returnKeyType="next"
            onSubmitEditing={() => stateRef.current?.focus()}
            blurOnSubmit={false}
            maxLength={50}
          />
        </View>
        <View style={styles.country}>
          <Text style={styles.title}>State</Text>
          <TextInput
            ref={stateRef}
            style={[styles.input, styles.inputText]}
            value={address.state}
            placeholder="State"
            placeholderTextColor={theme.colors.lightGray}
            onChangeText={text => setAddress('state', text)}
            maxLength={50}
            onSubmitEditing={() => countryRef.current?.focus()}
            returnKeyType="next"
          />
        </View>
      </View>
      <View style={styles.countryView}>
        <View style={styles.city}>
          <Text style={styles.title}>Country</Text>
          <TextInput
            ref={countryRef}
            style={[styles.input, styles.inputText]}
            value={address.country}
            placeholder="Country"
            placeholderTextColor={theme.colors.lightGray}
            onChangeText={text => setAddress('country', text)}
            returnKeyType="next"
            onSubmitEditing={() => pincodeRef.current?.focus()}
            blurOnSubmit={false}
            maxLength={60}
          />
        </View>
        <View style={styles.country}>
          <Text style={styles.title}>Pincode</Text>
          <TextInput
            ref={pincodeRef}
            style={[styles.input, styles.inputText]}
            value={address.pincode}
            placeholder="Pincode"
            placeholderTextColor={theme.colors.lightGray}
            onChangeText={text => setAddress('pincode', text)}
            maxLength={20}
            keyboardType="number-pad"
            returnKeyType="next"
            onSubmitEditing={() => landMarkRef.current?.focus()}
            blurOnSubmit={false}
          />
        </View>
      </View>
      <Text style={styles.title}>Landmark</Text>
      <TextInput
        ref={landMarkRef}
        style={[styles.input, styles.inputText]}
        value={address.landMark}
        placeholder="Please enter your Landmark here"
        placeholderTextColor={theme.colors.lightGray}
        onChangeText={text => setAddress('landMark', text)}
        returnKeyType="next"
        onSubmitEditing={() => phoneNumberRef.current?.focus()}
        blurOnSubmit={false}
        maxLength={300}
      />
      <Text style={styles.title}>Phone Number</Text>
      <TextInput
        ref={phoneNumberRef}
        style={[styles.input, styles.inputText]}
        value={address.phoneNumber}
        placeholder="Please enter your phone number here"
        placeholderTextColor={theme.colors.lightGray}
        onChangeText={text => setAddress('phoneNumber', text)}
        keyboardType="phone-pad"
        maxLength={20}
      />
    </View>
  );
};

export default AddressForm;
