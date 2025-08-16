import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {theme} from '@app/constants';
import {useAppContext} from '@app/store/appContext';

const ArticleListHeader = () => {
  const {appConfigData} = useAppContext();
  const styles = StyleSheet.create({
    textContainer: {
      flexDirection: 'row',
      alignSelf: 'flex-start',
      paddingBottom: 25,
      paddingHorizontal: theme.cardPadding.defaultPadding,
    },
    textStyles: {
      fontFamily: theme.fonts.HCLTechRoobert.medium,
      fontSize: theme.fontSize.font20,
      color: appConfigData?.secondary_text_color,
    },
  });

  return (
    <View style={styles.textContainer}>
      <Text style={styles.textStyles}>Stories you might love</Text>
    </View>
  );
};

export default React.memo(ArticleListHeader);
