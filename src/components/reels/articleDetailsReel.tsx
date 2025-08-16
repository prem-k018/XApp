/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import ArticleDetails from '@app/screens/articleDetails/articleDetails';
import BasicHeader from '../ui-components/basicHeader';
import CardTypes from '../cards/cardTypes';

const ArticleDetailsReel = (props: {
  id: string;
  reel: {prevReelFn: () => void; nextReelFn: () => void};
}) => {
  const {id, reel} = props;

  const [url, setUrl] = useState<string>('');
  const [downFlingActive, setDownFlingActive] = useState<boolean>(true);
  const [upFlingActive, setUpFlingActive] = useState<boolean>(true);

  const downFling = Gesture.Fling()
    .enabled(downFlingActive)
    .direction(Directions.DOWN)
    .onEnd((_, success) => {
      if (success) {
        reel.prevReelFn();
      }
    });

  const upFling = Gesture.Fling()
    .enabled(upFlingActive)
    .direction(Directions.UP)
    .onEnd((_, success) => {
      if (success) {
        reel.nextReelFn();
      }
    });

  const flings = Gesture.Exclusive(downFling, upFling);

  const nativeGesture = Gesture.Native();

  const scrollViewCompositeGesture = Gesture.Exclusive(flings, nativeGesture);

  return (
    <>
      <GestureDetector gesture={scrollViewCompositeGesture}>
        <ArticleDetails
          route={{
            params: {
              data: {Id: id},
              isReel: true,
              setDownFlingActive,
              setUpFlingActive,
              updatePageUrl: (newUrl: string) => setUrl(newUrl),
            },
          }}
        />
      </GestureDetector>
      <BasicHeader
        id={id}
        contentType={CardTypes.Article.toString()}
        url={url}
      />
    </>
  );
};

export default React.memo(ArticleDetailsReel);
