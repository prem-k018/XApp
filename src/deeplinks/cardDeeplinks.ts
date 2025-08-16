import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ScreenNames from '@app/constants/screenNames';
import CardType from '@app/components/cards/cardTypes';
import {Content} from '@app/model/content';
import {storeRecommendationList} from '@app/utils/notificationsHelper';
import {MyStory} from '@app/model/myStories';

// Export the handleCardClick function
export const useHandleCardClick = (data: any, recentItems: any[]) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleCardClick = async () => {
    if (data.ContentType !== CardType.Video) {
      storeRecommendationList(data);
    }

    switch (data.ContentType) {
      case CardType.Article:
        navigation?.navigate(ScreenNames.articleDetails, {
          data,
          recentItems,
        });
        break;
      case CardType.Video:
        navigation?.navigate(ScreenNames.reelsScreen, {
          data,
          recentItems,
        });
        break;
      case CardType.Poll:
        navigation?.navigate(ScreenNames.poll, {
          data,
          recentItems,
        });
        break;
      case CardType.Quiz:
        navigation?.navigate(ScreenNames.quiz, {
          data,
          recentItems,
        });
        break;
      case CardType.EventDetails:
        navigation?.navigate(ScreenNames.eventDetails, {
          data,
        });
        break;
      case CardType.Banner:
        navigation?.navigate(ScreenNames.webViewHomeScreen, {
          data,
        });
        break;
      default:
        break;
    }
  };

  return handleCardClick;
};

export const useHandleCarouselClick = (data: Content[] | MyStory[], index: number) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleCarouselClick = () => {
    navigation?.navigate(ScreenNames.storiesScreen, {
      stories: data,
      currStoryIndex: index,
    });
  };

  return handleCarouselClick;
};
