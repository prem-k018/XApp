/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/react-in-jsx-scope */
import {icons} from '@app/assets/icons';
import {theme} from '@app/constants';
import {useAppContext} from '@app/store/appContext';
import {loadImageForHomePage} from '@app/utils/imageLinkUtils';
import screensUtils from '@app/utils/screensUtils';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';

export type Props = {
  data: any;
  index: number;
};

const StoresItem: React.FC<Props> = ({data}) => {
  const {appConfigData} = useAppContext();
  const screenWidth = screensUtils.screenWidth;
  const containerWidth =
    screenWidth - (theme.cardMargin.left + theme.cardMargin.right);
  const imageWidth = (containerWidth - (10 + 10 + 16)) / 2;

  const result = loadImageForHomePage(data);
  const storeLocation = 'Lucknow';

  const handleOpenMap = () => {
    // Check if the Google Maps app is installed
    Linking.canOpenURL('https://maps.google.com').then(supported => {
      if (supported) {
        // If yes, then open the Google Maps app with specified location
        Linking.openURL(`https://maps.google.com?q=${storeLocation}`);
      } else {
        // If no, then open the Google Maps with sepcified loaction in browser
        Linking.openURL(
          `https://www.google.com/maps/search/?api=1&query=${storeLocation}`,
        );
      }
    });
  };

  const styles = StyleSheet.create({
    content: {
      width: containerWidth,
      paddingVertical: theme.cardPadding.defaultPadding,
      paddingHorizontal: 10,
      marginLeft: theme.cardMargin.left,
      borderRadius: theme.border.borderRadius,
      backgroundColor: appConfigData?.background_color,
      gap: theme.cardPadding.defaultPadding,
      flexDirection: 'row',
    },
    image: {
      height: imageWidth,
      width: imageWidth,
    },
    rightSide: {
      width: imageWidth,
      height: 'auto',
      gap: 4,
      justifyContent: 'center',
    },
    title: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
    },
    storeView: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 3,
    },
    store: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font12,
      color: appConfigData?.secondary_text_color,
    },
    ratingView: {
      flexDirection: 'row',
      gap: 3,
    },
    ratingText: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font10,
      color: appConfigData?.secondary_text_color,
    },
    starIcon: {
      alignSelf: 'center',
      height: 12,
      width: 12,
    },
    buttonView: {
      paddingVertical: 10,
      width: 150,
      paddingHorizontal: theme.cardMargin.left,
      backgroundColor: appConfigData?.primary_color,
      borderRadius: theme.border.borderRadius,
      marginTop: theme.cardMargin.top,
    },
    buttonText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.primary_text_color,
      alignSelf: 'center',
    },
  });

  return (
    <View style={styles.content}>
      {result.isColor ? (
        <View style={[styles.image, {backgroundColor: result.value}]}></View>
      ) : (
        <FastImage
          style={styles.image}
          source={{
            uri: result.value,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}
      <View style={styles.rightSide}>
        <Text numberOfLines={1} style={styles.title}>
          {data.Title}
        </Text>
        <View style={styles.storeView}>
          <Text style={styles.store}>Official Store</Text>
          <Image source={icons.authorVerified} style={{alignSelf: 'center'}} />
        </View>
        <View style={styles.ratingView}>
          <Text style={[styles.ratingText, {paddingRight: 10}]}>
            Store Rating
          </Text>
          <Text style={styles.ratingText}>4.6</Text>
          <Image source={icons.ratingStar} style={styles.starIcon} />
        </View>
        <TouchableOpacity
          onPress={handleOpenMap}
          style={styles.buttonView}
          activeOpacity={1}>
          <Text style={styles.buttonText}>View on Map</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StoresItem;
