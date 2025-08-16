/* eslint-disable react-native/no-inline-styles */
import {useHandleCarouselClick} from '@app/deeplinks/cardDeeplinks';
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {theme} from '@app/constants';
import {Content} from '@app/model/content';
import {loadImageForHomePage} from '@app/utils/imageLinkUtils';
import {useAppContext} from '@app/store/appContext';

const HomeCarousel = ({data}: {data: Content[]}) => {
  const {appConfigData} = useAppContext();

  const styles = StyleSheet.create({
    carousel: {
      paddingLeft: 0, // Adjust the left padding to offset the initial item
      paddingBottom: theme.cardMargin.bottom,
    },
    titleText: {
      fontFamily: theme.fonts.HCLTechRoobert.bold,
      fontSize: theme.fontSize.font18,
      color: appConfigData?.secondary_color,
      marginBottom: 10,
      marginLeft: theme.cardMargin.bottom,
    },
  });

  return (
    <>
      <Text style={styles.titleText} numberOfLines={1}>
        HIGHLIGHTS
      </Text>
      <FlatList
        data={data}
        renderItem={({index}) => <CarouselItem data={data} index={index} />}
        keyExtractor={(item, index) => `${item.Id}${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
      />
    </>
  );
};

const CarouselItem = ({data, index}: {data: Content[]; index: number}) => {
  const result = loadImageForHomePage(data[index]);
  const handleCarouselClick = useHandleCarouselClick(data, index);
  const {appConfigData} = useAppContext();
  const styles = StyleSheet.create({
    carousel: {
      paddingLeft: 0, // Adjust the left padding to offset the initial item
      paddingBottom: theme.cardMargin.bottom,
    },
    carouselItem: {
      width: 150, // Width of each carousel item
      height: 240, // Width of each carousel item
      marginRight: theme.cardMargin.right, // Adjust the right margin to create spacing between items
      borderRadius: theme.card.defaultBorderRadius,
    },
    image: {
      flex: 1,
      width: 150,
      borderRadius: theme.card.defaultBorderRadius,
    },
    gradient: {
      flex: 1,
      width: 150,
      padding: theme.cardMargin.left,
      borderRadius: theme.card.defaultBorderRadius,
      justifyContent: 'flex-end',
    },
    title: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      fontSize: theme.fontSize.font18,
      color: appConfigData?.primary_text_color,
    },
  });
  return (
    <TouchableOpacity onPress={handleCarouselClick}>
      <View
        style={[
          styles.carouselItem,
          index === 0 ? {marginLeft: theme.cardMargin.left} : null,
        ]}>
        <ImageBackground
          source={{uri: result.value}}
          resizeMode="cover"
          style={styles.image}
          imageStyle={styles.image}>
          <LinearGradient
            start={{x: 0.0, y: 0.0}}
            end={{x: 0.0, y: 0.72}}
            colors={['#00000000', '#000000CC']}
            style={styles.gradient}>
            <Text style={styles.title} numberOfLines={4}>
              {data[index].Title}
            </Text>
          </LinearGradient>
        </ImageBackground>
        {/* Add your content for each carousel item */}
      </View>
    </TouchableOpacity>
  );
};

export default HomeCarousel;
