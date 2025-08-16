import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ScreenNames from '@app/constants/screenNames';
import CardType from '@app/components/cards/cardTypes';
import {Content} from '@app/model/content';
import {productView} from '@app/constants/constants';
import {addEventForTracking} from '@app/services/tracking/rpiServices';

// Export the handleCardClick function
export const useHandleRetailCardClick = (data: any) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleCardClick = () => {
    switch (data.ecomx_doc_type) {
      case CardType.Products:
        data.screenType = productView;
        addEventForTracking(data)
        navigation?.push(ScreenNames.productDetails, {
          data,
        });
        break;

      default:
        break;
    }
  };

  return handleCardClick;
};

export const useHandleCarouselClick = (data: Content[], index: number) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleCarouselClick = () => {
    navigation?.navigate(ScreenNames.storiesScreen, {
      stories: data,
      currStoryIndex: index,
    });
  };

  return handleCarouselClick;
};
