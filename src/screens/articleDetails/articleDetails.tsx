/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import {StyleSheet, ScrollView, Dimensions} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {icons} from '@app/assets/icons';
import ArticleCardImage from '@app/components/ArticleCard/ArticleCardImage';
import ArticleCardTagContainer from '@app/components/ArticleCard/ArticleCardTagContainer';
import ArticleCardDescription from '@app/components/ArticleCard/ArticleCardDescription';
import ArticleCardAuthor from '@app/components/ArticleCard/ArticleCardAuthor';
import LoadingScreen from '../loadingScreen/loadingScreen';
import LatestArticlesList from '@app/components/ArticleCard/LatestArticlesList';
import {theme} from '@app/constants';
import ArticleListHeader from '@app/components/ArticleCard/ArticleListHeader';
import SafeAreaUtils from '@app/utils/safeAreaUtils';
import BasicHeader from '@app/components/ui-components/basicHeader';
import CardTypes from '@app/components/cards/cardTypes';
import {sessionTimeout} from '@app/constants/errorCodes';
import {loadImage} from '@app/utils/imageLinkUtils';
import providePoints from '@app/services/openLoyalty/loyaltyPoint';
import {addEventForTracking} from '@app/services/tracking/rpiServices';
import {view} from '@app/constants/constants';
import FastImage from 'react-native-fast-image';
import getContentDetail from '@app/services/contentType/contentDetail';
import {ArticleDetail} from '@app/model/contentType/article';

const ArticleDetails: React.FC = ({route}: any) => {
  const [response, setResponse] = useState<ArticleDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [pageUrl, setPageUrl] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  const dimensions = Dimensions.get('window');
  const imageWidth = dimensions.width;
  const imageHeight = dimensions.height;
  const safeAreaFrame = SafeAreaUtils.getSafeAreaFrame();

  const {
    data,
    isReel = false,
    setDownFlingActive = () => {},
    setUpFlingActive = () => {},
    updatePageUrl = () => {},
  } = route.params;
  const defaultImage =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIoAAACKCAMAAABCWSJWAAAAUVBMVEXd3d3g4ODNzc3j4+M7Ozupqal7e3vR0dGLi4tdXV3o6Ohvb2/W1tZsbGycnJxKSkqSkpIAAACxsbF1dXU2NjbHx8dRUVEgICARERG+vr64uLiybrQAAAAAzUlEQVR4nO3WSRKCMBBA0Qw2kTYDGnG6/0GNLpAbtIv/FlSxyq8UaeIcAAAAAAAAAAAAAAAw5TfWIamcvnp5ReOUcF3qcGxLFdsWHw45DqG5OmfrlOS882tLms7J8nv5pGivcW05+tQvhi3flHnRtVURuYl1yiQx9FLKqVmnbMv72Trl90LKPiV//EWKyvn+mNTbp4zDPPblMqdonhLlOeZtkGy+K1lVx19oPNU45Xr8sR1xuU87L9P7U9yzvskBAAAAAAAAAAAAAAD8tzdQYAdOgzoIUQAAAABJRU5ErkJggg==';

  const articleData = data;

  useEffect(() => {
    getData({showLoader: true});
    const appViewTracking = async () => {
      const data = {
        screenType: view,
        content_type: CardTypes.Article,
        contentData: articleData,
      };
      await addEventForTracking(data);
    };
    appViewTracking();
  }, []);

  async function getData(options: {showLoader: boolean}) {
    const {showLoader} = options;

    try {
      if (showLoader) {
        setIsLoading(true); // Show loading indicator
        setIsError(null); // Reset the error message
      }

      const type = 'Article';
      const contents = await getContentDetail(data.Id as any, type);

      if ('data' in contents && contents?.data?.publish_contentDetail) {
        setResponse(contents?.data?.publish_contentDetail);
        const portraitImage =
          contents?.data?.publish_contentDetail?.original_image
            ?.original_image_relative_path;
        const ext =
          contents?.data?.publish_contentDetail?.original_image?.ext || '';
        let bannerURL = defaultImage;
        if (portraitImage) {
          bannerURL = loadImage(portraitImage, ext);
          FastImage.preload([{uri: bannerURL}]);
          setImageUrl(bannerURL);
        }
        setIsLoading(false);
        if (isReel) {
          updatePageUrl(
            contents?.data?.publish_contentDetail?.current_page_url,
          );
        } else {
          setPageUrl(contents?.data?.publish_contentDetail?.current_page_url);
        }
        await providePoints(data.Id ?? '');
      } else {
        setIsError('Something went wrong!!!!'); // Set the error message
      }
    } catch (err: any) {
      console.log(err.message);

      if (err.message !== sessionTimeout) {
        setIsError('Something went wrong!!!!'); // Set the error message
      }
    }
  }

  const handleRetry = () => {
    getData({showLoader: true});
  };

  const arrowClicked = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: imageHeight - (safeAreaTopInset + 30),
        animated: true,
      });
    }
  };

  const scrollViewRef = useRef<ScrollView>(null);
  const safeAreaTopInset = SafeAreaUtils.getSafeAreaInsets().top;

  return isLoading ? (
    <>
      <LoadingScreen
        isLoading={isLoading}
        error={isError}
        onRetry={handleRetry}
      />
      {!isReel && (
        <BasicHeader
          id={data.Id}
          contentType={CardTypes.Article.toString()}
          url={pageUrl}
        />
      )}
    </>
  ) : (
    <>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
        {...(isReel
          ? {
              onContentSizeChange: (contentWidth, contentHeight) => {
                if (contentHeight <= safeAreaFrame.height) {
                  setDownFlingActive(true);
                  setUpFlingActive(true);
                } else {
                  setDownFlingActive(true);
                  setUpFlingActive(false);
                }
              },
              onScrollBeginDrag: () => {
                setDownFlingActive(false);
                setUpFlingActive(false);
              },
              onMomentumScrollEnd: event => {
                const contentHeight = event.nativeEvent.contentSize.height;
                const layoutHeight = event.nativeEvent.layoutMeasurement.height;
                const contentOffset = event.nativeEvent.contentOffset.y;
                const onScreenContentEnd = layoutHeight + contentOffset;
                const NEAR_EDGE_THRESHOLD = 50;
                //Check if near top
                if (contentOffset < NEAR_EDGE_THRESHOLD) {
                  setDownFlingActive(true);
                }
                //Check if near bottom
                if (
                  Math.abs(contentHeight - onScreenContentEnd) <
                  NEAR_EDGE_THRESHOLD
                ) {
                  setUpFlingActive(true);
                }
              },
            }
          : {})}>
        <ArticleCardImage
          imageHeight={imageHeight}
          imageWidth={imageWidth}
          articleImage={imageUrl ?? defaultImage}
          articleTitle={response?.title ?? ''}
          icon={icons.articleScroll}
          arrowPressed={arrowClicked}
        />
        <ArticleCardTagContainer
          articleTags={response?.tags ?? []}
          icon={icons.timePosted}
          articleTimePosted={response?.last_modification_date}
        />
        <ArticleCardDescription description={response?.description ?? ''} />
        <ArticleCardAuthor
          name={response?.page_lastmodifiedby ?? ''}
          datePosted={response?.developed_date}
        />
        {response?.latest_articles.length !== 0 && <ArticleListHeader />}

        {response?.latest_articles && (
          <LatestArticlesList data={response?.latest_articles ?? []} />
        )}
      </ScrollView>
      {!isReel && (
        <BasicHeader
          id={data.Id}
          contentType={CardTypes.Article.toString()}
          url={pageUrl}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconStyle: {
    height: 30,
    width: 30,
    backgroundColor: theme.colors.headerButtonBGColor,
    borderRadius: theme.border.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerView: {
    flexDirection: 'row',
    gap: theme.cardPadding.defaultPadding,
  },
});

export default ArticleDetails;
