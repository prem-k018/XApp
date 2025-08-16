import React from 'react';
import CarouselTypes from './carouselTypes';
import HomeCarousel from './homeCarousel';
import FavouriteCarousel from './favouriteCarousel';
import {MyStory} from '@app/model/myStories';
interface GenericCarouselProps {
  type: CarouselTypes;
  carouselData: MyStory[] | any;
}

const Carousels: React.FC<GenericCarouselProps> = ({type, carouselData}) => {
  switch (type) {
    case CarouselTypes.Home:
      return <HomeCarousel data={carouselData} />;
    case CarouselTypes.Favourite:
      return <FavouriteCarousel data={carouselData} />;
    default:
      return null;
  }
};

export default Carousels;
