import {StyleSheet, View, FlatList} from 'react-native';
import React from 'react';
import LatestArticleItem from './LatestArticleItem';

const LatestArticlesList = ({data}: any) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
          <LatestArticleItem item={item} index={index} />
        )}
        nestedScrollEnabled
      />
    </View>
  );
};

export default React.memo(LatestArticlesList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingBottom: 40,
  },
});
