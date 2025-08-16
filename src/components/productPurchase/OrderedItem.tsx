import {theme} from '@app/constants';
import {LineItem} from '@app/model/productPurchase/orderDetail';
import {useAppContext} from '@app/store/appContext';
import {getCurrencySymbol} from '@app/utils/HelperFunction';
import screensUtils from '@app/utils/screensUtils';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';

export type Props = {
  data: LineItem;
  currencyCode: string;
};

const OrderedItems: React.FC<Props> = ({data, currencyCode}) => {
  const {appConfigData} = useAppContext();
  const screenWidth = screensUtils.screenWidth;
  const containerWidth =
    screenWidth - (theme.cardMargin.left + theme.cardMargin.right);
  const imageWidth = (containerWidth - (10 + 10 + 16)) / 2;

  let imageObj = '';

  if (data.attr_images?.length > 0) {
    imageObj = data.attr_images[0];
  }

  const styles = StyleSheet.create({
    content: {
      width: containerWidth,
      paddingVertical: theme.cardPadding.defaultPadding,
      paddingHorizontal: theme.cardPadding.defaultPadding,
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
      gap: theme.cardPadding.smallXsize,
      justifyContent: 'center',
    },
    title: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
    },
    ratingText: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font12,
      color: '#838589',
    },
    cost: {
      fontFamily: theme.fonts.DMSans.bold,
      fontSize: theme.fontSize.font14,
      color: theme.colors.red,
    },
  });

  return (
    <View style={styles.content} key={data.productId}>
      {imageObj && (
        <FastImage
          style={styles.image}
          source={{
            uri: imageObj,
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      )}
      <View style={styles.rightSide}>
        <Text numberOfLines={2} style={styles.title}>
          {data.name}
        </Text>
        <Text style={styles.ratingText}>
          Qunatity : {data?.quantity ? data?.quantity : 1}
        </Text>
        <Text style={styles.ratingText}>
          Category : {data?.attr_categories[0].name}
        </Text>
        <Text style={styles.cost}>
          {getCurrencySymbol(currencyCode)}
          {parseFloat(data?.price as any).toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

export default OrderedItems;
