import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {theme} from '@app/constants';
import {formatDate} from '@app/utils/date&timeUtils';
import {useAppContext} from '@app/store/appContext';
import {images} from '@app/assets/images';

export type Props = {
  name: string;
  datePosted: any;
};

const ArticleCardAuthor: React.FC<Props> = ({name, datePosted}) => {
  // default picture
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
      height: 40,
      width: 40,
      borderRadius: theme.border.borderRadius,
    },
    authorContainer: {
      marginHorizontal: 20,
      gap: 3,
    },
    authorName: {
      fontFamily: theme.fonts.Inter.regular,
      fontSize: theme.fontSize.font18,
      color: appConfigData?.secondary_text_color,
    },
    date: {
      fontFamily: theme.fonts.Inter.regular,
      fontSize: theme.fontSize.font12,
      color: appConfigData?.secondary_text_color,
    },
  });

  return (
    <View style={styles.container}>
      <Image source={images.getProfileIcon} style={styles.imageContainer} />
      <View style={styles.authorContainer}>
        <Text style={styles.authorName}>{name}</Text>
        <Text style={styles.date}>{formatDate(datePosted)}</Text>
      </View>
    </View>
  );
};

export default React.memo(ArticleCardAuthor);
