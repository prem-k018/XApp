/* eslint-disable react/self-closing-comp */
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {theme} from '@app/constants';
import {useAppContext} from '@app/store/appContext';
import FastImage from 'react-native-fast-image';

export type Props = {
  imageHeight: number;
  imageWidth: number;
  articleImage: string;
  articleTitle: string;
  icon: any;
  arrowPressed: () => void;
};

const ArticleCardImage: React.FC<Props> = ({
  imageHeight,
  imageWidth,
  articleImage,
  articleTitle,
  icon,
  arrowPressed,
}) => {
  const {appConfigData} = useAppContext();

  const styles = StyleSheet.create({
    titleView: {
      position: 'absolute',
      alignItems: 'center',
      left: theme.cardPadding.defaultPadding,
      right: theme.cardPadding.defaultPadding,
      bottom: 49,
    },
    title: {
      color: appConfigData?.primary_text_color,
      fontFamily: theme.fonts.HCLTechRoobert.medium,
      fontSize: theme.fontSize.font28,
    },
    linearGradient: {
      backgroundColor: 'transparent',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  });

  return (
    <View>
      <FastImage
        style={{height: imageHeight, width: imageWidth}}
        source={{uri: articleImage, priority: FastImage.priority.high}}
        resizeMode="cover">
        <LinearGradient
          colors={['#00000000', '#00000080']}
          style={styles.linearGradient}></LinearGradient>
      </FastImage>
      <View style={styles.titleView}>
        <Text numberOfLines={3} style={styles.title}>
          {articleTitle}
        </Text>
        <TouchableOpacity
          onPress={arrowPressed}
          hitSlop={{bottom: 20, left: 20, top: 20, right: 20}}>
          <Image source={icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(ArticleCardImage);
