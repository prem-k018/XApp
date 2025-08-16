import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {theme} from '@app/constants';
import {useAppContext} from '@app/store/appContext';

export type Props = {
  data: any;
};

const OrderSummary: React.FC<Props> = ({data}) => {
  const {appConfigData} = useAppContext();

  const styles = StyleSheet.create({
    details: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
    },
    bottomView: {
      justifyContent: 'flex-end',
      backgroundColor: appConfigData?.background_color,
    },
    orderSummaryView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: theme.cardPadding.smallXsize,
      borderBottomWidth: theme.border.borderWidth,
      borderBottomColor: '#EDEDED',
    },
  });

  return (
    <View style={styles.bottomView}>
      {data.map((item: any) => (
        <View key={item.key}>
          {!item.hidden && (
            <View
              style={[
                styles.orderSummaryView,
                item.key === 'Order Total' && {
                  borderBottomWidth: 0,
                },
              ]}>
              <Text
                style={[
                  styles.details,
                  item.key === 'Order Total' && {
                    fontFamily: theme.fonts.DMSans.bold,
                  },
                ]}>
                {item.key}
              </Text>
              <Text
                style={[
                  styles.details,
                  item.key === 'Order Total' && {
                    fontFamily: theme.fonts.DMSans.bold,
                  },
                ]}>
                {item.value}
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default OrderSummary;
