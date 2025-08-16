//TODO need to figure out if we're deprecating or if we're going to keep for content
// such as tweets which will require significantly different enough UI to require
// separate components
import React from 'react';
import CardType from '@app/components/cards/cardTypes';
import Card from './card';
import PlayerCard from './playerCard';
import Banner from './banner';

interface GenericCardProps {
  data: any; // Use the CardData type
  recentItems: any[];
}

const Cards: React.FC<GenericCardProps> = props => {
  switch (props.data.ContentType) {
    case CardType.Article:
      return <Card {...props} />;
    case CardType.Image:
      return <Card {...props} />;
    case CardType.Video:
      return <Card {...props} />;
    case CardType.PlayerProfile:
      return <PlayerCard {...props} />;
    case CardType.EventDetails:
      return <Card {...props} />;
    default:
      return <Card {...props} />; // Handle unsupported types or provide a default card
  }
};

export default Cards;
