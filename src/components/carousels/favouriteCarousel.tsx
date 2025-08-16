/* eslint-disable react-native/no-inline-styles */
import {useHandleCarouselClick} from '@app/deeplinks/cardDeeplinks';
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {theme} from '@app/constants';
import {loadImageForHomePage} from '@app/utils/imageLinkUtils';
import {useAppContext} from '@app/store/appContext';
import {icons} from '@app/assets/icons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ScreenNames from '@app/constants/screenNames';
import {MyStory} from '@app/model/myStories';
import {getContentIcon} from '@app/utils/HelperFunction';
import SpinWheel from '../UserOLProfile/SpinWheel';

export type Props = {
  data: MyStory[];
  inUserProfile?: boolean;
  spinWheel?: boolean;
};

const FavouriteCarousel: React.FC<Props> = ({
  data,
  inUserProfile,
  spinWheel,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {appConfigData} = useAppContext();

  const handleFilterIconPress = () => {
    navigation?.navigate(ScreenNames.onboardingSecondScreen, {
      searchTerm: true,
    });
  };

  const styles = StyleSheet.create({
    carousel: {
      paddingHorizontal: theme.cardMargin.left,
      paddingBottom: theme.cardMargin.bottom,
      gap: theme.cardPadding.smallXsize,
    },
    headingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginRight: theme.cardMargin.left,
    },
    titleText: {
      fontFamily: spinWheel
        ? theme.fonts.DMSans.medium
        : theme.fonts.DMSans.bold,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.secondary_color,
      marginBottom: inUserProfile
        ? theme.cardMargin.bottom
        : theme.cardPadding.smallXsize,
      marginLeft: theme.cardMargin.left,
    },
    contentIconView: {
      height: 30,
      width: 30,
      backgroundColor: '#EFF0F6',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.border.borderRadius,
    },
  });

  return (
    <>
      <View style={styles.headingContainer}>
        <Text style={styles.titleText} numberOfLines={1}>
          {spinWheel ? 'Spin and Win' : 'MY STORIES'}
        </Text>
        {inUserProfile && !spinWheel && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleFilterIconPress}
            style={styles.contentIconView}>
            <Image source={icons.HashTagIcon} />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={data}
        renderItem={({index}) => (
          <CarouselItem
            data={data}
            index={index}
            inUserProfile={inUserProfile}
            spinWheel={spinWheel}
          />
        )}
        keyExtractor={(item, index) => `${item.Id}${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
      />
    </>
  );
};

const CarouselItem = ({
  data,
  index,
  inUserProfile,
  spinWheel,
}: {
  data: MyStory[];
  index: number;
  inUserProfile?: boolean;
  spinWheel?: boolean;
}) => {
  const result = loadImageForHomePage(data[index]);
  const [visible, setVisible] = useState<boolean>(false);
  const handleCarouselClick = useHandleCarouselClick(data, index);
  const {appConfigData} = useAppContext();
  const styles = StyleSheet.create({
    carousel: {
      paddingLeft: 0,
      paddingBottom: theme.cardMargin.bottom,
    },
    carouselItem: {
      width: inUserProfile ? 280 : 130,
      height: inUserProfile ? 215 : 150,
      borderRadius: theme.border.borderRadius,
    },
    image: {
      flex: 1,
      width: '100%',
      borderRadius: theme.border.borderRadius,
    },
    gradient: {
      flex: 1,
      width: '100%',
      borderRadius: theme.border.borderRadius,
      justifyContent: 'flex-end',
    },
    title: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.primary_text_color,
      padding: 10,
    },
    icon: {
      marginLeft: theme.cardPadding.smallXsize,
    },
  });

  return (
    <TouchableOpacity
      onPress={() => (spinWheel ? setVisible(true) : handleCarouselClick())}
      activeOpacity={1}>
      <View style={styles.carouselItem}>
        {result.isColor ? (
          <View style={[styles.image, {backgroundColor: result.value}]}>
            <LinearGradient
              start={{x: 0.0, y: 0.0}}
              end={{x: 0.0, y: 0.72}}
              colors={['#00000000', '#000000CC']}
              style={styles.gradient}>
              <Text style={styles.title} numberOfLines={2}>
                {data[index]?.Title}
              </Text>
            </LinearGradient>
          </View>
        ) : (
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
              <>
                <Image
                  source={getContentIcon(data[index]?.ContentType)}
                  style={styles.icon}
                />
                <Text style={styles.title} numberOfLines={2}>
                  {data[index]?.Title}
                </Text>
              </>
            </LinearGradient>
          </ImageBackground>
        )}
        {/* Add your content for each carousel item */}
      </View>
      {visible && (
        <SpinWheel
          data={data[index]}
          visible={visible}
          onClose={() => setVisible(false)}
        />
      )}
    </TouchableOpacity>
  );
};

export default FavouriteCarousel;
