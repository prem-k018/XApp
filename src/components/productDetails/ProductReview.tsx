import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useAppContext} from '@app/store/appContext';
import {icons} from '@app/assets/icons';
import {theme} from '@app/constants';

const ProductReview = () => {
  const [seeAllReview, setSeeAllReview] = useState<boolean>(false);
  const {appConfigData} = useAppContext();

  const data = [
    {
      user_image:
        'https://s3-alpha-sig.figma.com/img/a384/9086/07ce99b063794da630c8a761c99e97b6?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Xsj65PPhdBTA089R0SgFA2aa~1s3U7dHVoG2NYt2n0aGHQaIo5bawqUTQ3C-Y4krmTGeHeQiRyXfgaB~LG-vLBB0mwG8kSmci0NV7KD00~1GCzxCeGFtpKHqx1HtBgtLhpW3LcwkcQH72iVUWjvp3jjbF-qQ3IOqD3bNvNYm~X6b5bTww5RV~MQ2sYjJwAfTPrKUp6egAHcael3QV08in3RkL2742Xq1FkdZQMMSV3gXj0GXWSTA--hk~UQBMX8mg~UB2rzb4yheV3dB2eAL61pErczD3PWqZHasoP2rrMp3z3pbDLH3wSCbbANgvSoeHH1gws9XzqidoyGTA86xhA__',
      user_name: 'Yelena Belova',
      rating: '5',
      review_post_date: '2 Week Ago',
      review:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      user_image:
        'https://s3-alpha-sig.figma.com/img/a384/9086/07ce99b063794da630c8a761c99e97b6?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Xsj65PPhdBTA089R0SgFA2aa~1s3U7dHVoG2NYt2n0aGHQaIo5bawqUTQ3C-Y4krmTGeHeQiRyXfgaB~LG-vLBB0mwG8kSmci0NV7KD00~1GCzxCeGFtpKHqx1HtBgtLhpW3LcwkcQH72iVUWjvp3jjbF-qQ3IOqD3bNvNYm~X6b5bTww5RV~MQ2sYjJwAfTPrKUp6egAHcael3QV08in3RkL2742Xq1FkdZQMMSV3gXj0GXWSTA--hk~UQBMX8mg~UB2rzb4yheV3dB2eAL61pErczD3PWqZHasoP2rrMp3z3pbDLH3wSCbbANgvSoeHH1gws9XzqidoyGTA86xhA__',
      user_name: 'Stephen Strange',
      rating: '3',
      review_post_date: '1 Month Ago',
      review:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      user_image:
        'https://s3-alpha-sig.figma.com/img/a384/9086/07ce99b063794da630c8a761c99e97b6?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Xsj65PPhdBTA089R0SgFA2aa~1s3U7dHVoG2NYt2n0aGHQaIo5bawqUTQ3C-Y4krmTGeHeQiRyXfgaB~LG-vLBB0mwG8kSmci0NV7KD00~1GCzxCeGFtpKHqx1HtBgtLhpW3LcwkcQH72iVUWjvp3jjbF-qQ3IOqD3bNvNYm~X6b5bTww5RV~MQ2sYjJwAfTPrKUp6egAHcael3QV08in3RkL2742Xq1FkdZQMMSV3gXj0GXWSTA--hk~UQBMX8mg~UB2rzb4yheV3dB2eAL61pErczD3PWqZHasoP2rrMp3z3pbDLH3wSCbbANgvSoeHH1gws9XzqidoyGTA86xhA__',
      user_name: 'Peter Parker',
      rating: '4',
      review_post_date: '2 Month Ago',
      review:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      user_image:
        'https://s3-alpha-sig.figma.com/img/a384/9086/07ce99b063794da630c8a761c99e97b6?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Xsj65PPhdBTA089R0SgFA2aa~1s3U7dHVoG2NYt2n0aGHQaIo5bawqUTQ3C-Y4krmTGeHeQiRyXfgaB~LG-vLBB0mwG8kSmci0NV7KD00~1GCzxCeGFtpKHqx1HtBgtLhpW3LcwkcQH72iVUWjvp3jjbF-qQ3IOqD3bNvNYm~X6b5bTww5RV~MQ2sYjJwAfTPrKUp6egAHcael3QV08in3RkL2742Xq1FkdZQMMSV3gXj0GXWSTA--hk~UQBMX8mg~UB2rzb4yheV3dB2eAL61pErczD3PWqZHasoP2rrMp3z3pbDLH3wSCbbANgvSoeHH1gws9XzqidoyGTA86xhA__',
      user_name: 'Stephen Strange',
      rating: '3',
      review_post_date: '1 Month Ago',
      review:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      user_image:
        'https://s3-alpha-sig.figma.com/img/a384/9086/07ce99b063794da630c8a761c99e97b6?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Xsj65PPhdBTA089R0SgFA2aa~1s3U7dHVoG2NYt2n0aGHQaIo5bawqUTQ3C-Y4krmTGeHeQiRyXfgaB~LG-vLBB0mwG8kSmci0NV7KD00~1GCzxCeGFtpKHqx1HtBgtLhpW3LcwkcQH72iVUWjvp3jjbF-qQ3IOqD3bNvNYm~X6b5bTww5RV~MQ2sYjJwAfTPrKUp6egAHcael3QV08in3RkL2742Xq1FkdZQMMSV3gXj0GXWSTA--hk~UQBMX8mg~UB2rzb4yheV3dB2eAL61pErczD3PWqZHasoP2rrMp3z3pbDLH3wSCbbANgvSoeHH1gws9XzqidoyGTA86xhA__',
      user_name: 'Peter Parker',
      rating: '4',
      review_post_date: '2 Month Ago',
      review:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
  ];

  const reviewData = seeAllReview ? data : data.slice(0, 3);
  const overAllRating = () => {
    const totalRating = data.length;
    const totalRatingSum = data.reduce(
      (sum, obj) => sum + parseInt(obj.rating, 10),
      0,
    );
    return totalRatingSum / totalRating;
  };

  const renderItem = ({item}: any) => {
    const yellowStars = Array.from(
      {length: parseInt(item.rating, 10)},
      (_, index) => (
        <Image source={icons.ratingStar} style={styles.starIcon} key={index} />
      ),
    );

    const whiteStars = Array.from(
      {length: 5 - parseInt(item.rating, 10)},
      (_, index) => (
        <Image
          source={icons.outlinedStarIcon}
          style={styles.whiteStarIcon}
          key={index}
        />
      ),
    );

    return (
      <View style={styles.content}>
        <View style={styles.reviewDetails}>
          <Image source={icons.vendor} style={styles.userImage} />
          <View>
            <Text style={styles.userNameText}>{item.user_name}</Text>
            <View style={styles.ratingView}>
              {yellowStars}
              {whiteStars}
            </View>
          </View>
          <Text style={styles.reviewPostedDate}>{item.review_post_date}</Text>
        </View>
        <Text
          numberOfLines={seeAllReview ? undefined : 3}
          style={styles.review}>
          {item.review}
        </Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      paddingVertical: 30,
      marginHorizontal: theme.cardMargin.left,
      gap: 30,
    },
    headingView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    headingText: {
      fontFamily: theme.fonts.DMSans.bold,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.secondary_text_color,
    },
    ratingView: {
      flexDirection: 'row',
      gap: 5,
    },
    ratingText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.secondary_text_color,
    },
    starIcon: {
      height: 17,
      width: 16,
      alignSelf: 'center',
    },
    whiteStarIcon: {
      alignSelf: 'center',
    },
    flatlistView: {
      gap: 20,
    },
    content: {
      gap: 10,
    },
    reviewDetails: {
      flexDirection: 'row',
      gap: theme.cardPadding.defaultPadding,
    },
    userImage: {
      height: 40,
      width: 40,
      borderRadius: 20,
      alignSelf: 'center',
    },
    userDetail: {},
    userNameText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
    },
    reviewPostedDate: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font12,
      color: '#838589',
      position: 'absolute',
      top: 0,
      right: 0,
    },
    review: {
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font12,
      color: appConfigData?.secondary_text_color,
      paddingLeft: 55,
    },
    button: {
      paddingVertical: theme.cardPadding.defaultPadding,
      borderWidth: theme.border.borderWidth,
      borderRadius: theme.border.borderRadius,
      borderColor: appConfigData?.secondary_text_color,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headingView}>
        <Text style={styles.headingText}>Retailer Reviews ({data.length})</Text>
        <View style={styles.ratingView}>
          <Image source={icons.ratingStar} style={styles.starIcon} />
          <Text style={styles.ratingText}>{overAllRating()}</Text>
        </View>
      </View>
      <FlatList
        contentContainerStyle={styles.flatlistView}
        data={reviewData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity
        style={styles.button}
        activeOpacity={1}
        onPress={() => setSeeAllReview(!seeAllReview)}>
        <Text style={styles.userNameText}>
          {!seeAllReview ? 'See All Review' : 'See Less Review'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductReview;
