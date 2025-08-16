import {StyleSheet, Text, View, Image} from 'react-native';
import React, {memo} from 'react';
import {icons} from '@app/assets/icons';
import {theme} from '@app/constants';

const ArticleReadMore = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Read more</Text>
      <Image source={icons.articleReadMore} />
    </View>
  );
};

export default memo(ArticleReadMore);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 14,
  },
  text: {
    color: theme.colors.blue,
    fontFamily: theme.fonts.HCLTechRoobert.regular,
    fontSize: theme.fontSize.font14,
  },
});
