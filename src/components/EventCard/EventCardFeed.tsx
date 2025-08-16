import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';
import EventCardFeedItem from './EventCardFeedItem';

export type Props = {
  data: any;
};
const EventCardFeed: React.FC<Props> = ({data}) => {
  const {appConfigData} = useAppContext();

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: theme.cardPadding.defaultPadding,
      gap: 24,
    },
    eventFeed: {
      fontSize: theme.fontSize.font20,
      fontFamily: theme.fonts.HCLTechRoobert.medium,
      color: appConfigData?.secondary_text_color,
    },
    borderLine: {
      borderBottomWidth: theme.border.borderWidth,
      borderBottomColor: theme.colors.grayScale4,
      marginVertical: 24,
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.eventFeed}>Event Feed</Text>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        renderItem={({item, index}) => (
          <>
            <EventCardFeedItem item={item} index={index} />
            <View style={styles.borderLine} />
          </>
        )}
        nestedScrollEnabled
      />
    </View>
  );
};

export default memo(EventCardFeed);
