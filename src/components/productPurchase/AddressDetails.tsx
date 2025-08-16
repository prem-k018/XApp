import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';
import {Address} from '@app/model/productPurchase/orderDetail';

export type Props = {
  address: Address | undefined;
};

const AddressDetails: React.FC<Props> = ({address}) => {
  const {appConfigData} = useAppContext();

  const styles = StyleSheet.create({
    headingText: {
      fontFamily: theme.fonts.DMSans.semiBold,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
      marginBottom: theme.cardMargin.xSmall,
    },
    details: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
    },
  });

  return (
    <View>
      <Text style={styles.headingText}>{address?.title}</Text>
      <Text style={styles.details}>{address?.street_name}</Text>
      <Text style={styles.details}>
        {address?.city && `${address?.city}, `}
        {address?.state} {address?.postal_code && `- ${address?.postal_code}`}
      </Text>
      <Text style={styles.details}>Email : {address?.email}</Text>
      {address?.additional_address_info && (
        <Text style={styles.details}>
          Land Mark : {address?.additional_address_info}
        </Text>
      )}
      <Text style={styles.details}>Contact No. : {address?.mobile}</Text>
    </View>
  );
};

export default AddressDetails;
