/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  ImageBackground,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {icons} from '@app/assets/icons';
import {theme} from '@app/constants';
import {Content} from '@app/model/content';
import {loadImageForHomePage} from '@app/utils/imageLinkUtils';
import {useAppContext} from '@app/store/appContext';

const ArticleStory: React.FC<{
  item: Content;
  story: {prevStoryFn: () => void; nextStoryFn: () => void};
  handleNavigation: () => void;
  text: string;
}> = params => {
  const defaultImage =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIoAAACKCAMAAABCWSJWAAAAUVBMVEXd3d3g4ODNzc3j4+M7Ozupqal7e3vR0dGLi4tdXV3o6Ohvb2/W1tZsbGycnJxKSkqSkpIAAACxsbF1dXU2NjbHx8dRUVEgICARERG+vr64uLiybrQAAAAAzUlEQVR4nO3WSRKCMBBA0Qw2kTYDGnG6/0GNLpAbtIv/FlSxyq8UaeIcAAAAAAAAAAAAAAAw5TfWIamcvnp5ReOUcF3qcGxLFdsWHw45DqG5OmfrlOS882tLms7J8nv5pGivcW05+tQvhi3flHnRtVURuYl1yiQx9FLKqVmnbMv72Trl90LKPiV//EWKyvn+mNTbp4zDPPblMqdonhLlOeZtkGy+K1lVx19oPNU45Xr8sR1xuU87L9P7U9yzvskBAAAAAAAAAAAAAAD8tzdQYAdOgzoIUQAAAABJRU5ErkJggg==';

  const result = loadImageForHomePage(params.item);
  const {appConfigData} = useAppContext();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingHorizontal: theme.cardPadding.defaultPadding,
      paddingBottom: 22,
      gap: 26,
    },
    title: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      color: appConfigData?.primary_text_color,
      fontSize: theme.fontSize.font28,
    },
    articleDetailsLinkView: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.cardPadding.smallXsize,
      paddingBottom: 22,
    },
    articleText: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      color: appConfigData?.primary_text_color,
      fontSize: theme.fontSize.font14,
    },
  });

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: result.value ?? defaultImage,
        }}
        resizeMode="cover"
        style={{flex: 1}}
        imageStyle={{flex: 1}}>
        <LinearGradient
          start={{x: 0.0, y: 0.08}}
          end={{x: 0.0, y: 1.09}}
          colors={['#00000000', '#000000CC']}
          style={styles.gradient}>
          <Text style={styles.title} numberOfLines={4}>
            {params?.item?.Title}
          </Text>
          <TouchableOpacity
            onPress={() => params.handleNavigation()}
            activeOpacity={1}>
            <View style={styles.articleDetailsLinkView}>
              <Text style={styles.articleText}>{params.text}</Text>
              <Image source={icons.thinForwardArrowWhite} />
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

export default ArticleStory;
