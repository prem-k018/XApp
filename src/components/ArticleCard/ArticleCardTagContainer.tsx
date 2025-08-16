import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import {theme} from '@app/constants';
import {timeToPresent} from '@app/utils/dateUtils';
import {useAppContext} from '@app/store/appContext';

export type Props = {
  articleTags: string[];
  icon: any;
  articleTimePosted: any;
};

const ArticleCardTagContainer: React.FC<Props> = ({
  articleTags,
  icon,
  articleTimePosted,
}) => {
  const {appConfigData} = useAppContext();
  const styles = StyleSheet.create({
    tagOuterContainer: {
      paddingVertical: 26,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.cardPadding.defaultPadding,
    },
    tagContainer: {
      flex: 1,
      flexWrap: 'wrap',
      flexDirection: 'row',
      gap: 10,
      marginRight: theme.cardPadding.defaultPadding,
    },
    tagElement: {
      borderRadius: theme.border.borderRadius,
      borderColor: appConfigData?.secondary_text_color,
      borderWidth: theme.border.borderWidth,
      fontSize: theme.fontSize.font14,
      fontFamily: theme.fonts.Inter.regular,
      paddingHorizontal: 8,
      paddingVertical: 4,
      color: appConfigData?.secondary_text_color,
    },
    timePostedContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    timePosted: {
      fontFamily: theme.fonts.Inter.regular,
      fontSize: theme.fontSize.font12,
      color: theme.colors.blue,
    },
  });

  return (
    <View style={styles.tagOuterContainer}>
      <View style={styles.tagContainer}>
        {articleTags.map(tag => (
          <Text key={tag} style={styles.tagElement}>
            {tag}
          </Text>
        ))}
      </View>
      <View style={styles.timePostedContainer}>
        <Image source={icon} />
        <Text style={styles.timePosted}>
          {timeToPresent(new Date(articleTimePosted))}
        </Text>
      </View>
    </View>
  );
};

export default React.memo(ArticleCardTagContainer);
