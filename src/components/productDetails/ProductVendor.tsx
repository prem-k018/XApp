import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {theme} from '@app/constants';
import {useAppContext} from '@app/store/appContext';
import {icons} from '@app/assets/icons';

export type Props = {
  name: string;
  datePosted: any;
};

const ProductVendor: React.FC<Props> = ({name}) => {
  const {appConfigData} = useAppContext();

  const styles = StyleSheet.create({
    container: {
      marginVertical: 30,
      flexDirection: 'row',
      alignSelf: 'flex-start',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.cardPadding.defaultPadding,
    },
    imageContainer: {
      height: 45,
      width: 45,
      borderRadius: 45 / 2,
      alignSelf: 'center',
    },
    authorContainer: {
      marginHorizontal: 20,
      gap: 3,
    },
    authorName: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
    },
    storeName: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font12,
      color: appConfigData?.secondary_text_color,
      paddingRight: 5,
    },
    owner: {
      flexDirection: 'row',
      alignSelf: 'flex-start',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Image source={icons.vendor} style={styles.imageContainer} />
      <View style={styles.authorContainer}>
        <Text style={styles.authorName}>{name}</Text>
        <View style={styles.owner}>
          <Text style={styles.storeName}>Verified Store</Text>
          <Image source={icons.authorVerified} />
        </View>
      </View>
    </View>
  );
};

export default React.memo(ProductVendor);
