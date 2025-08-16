import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';
import CategoriesItem from './CategoriesItem';
import StorageService from '@app/utils/storageService';
import {storedUserID} from '@app/constants/constants';
import fetchEcomPersonalizedProducts from '@app/services/product/personalizedContent';
import {EcomProduct} from '@app/model/product/personalizedContent';

export type Props = {
  headingText: string;
  onPress?: () => void;
  productId?: string;
  productType?: string;
};

const FeaturedCarousel: React.FC<Props> = ({
  headingText,
  productId,
  productType,
}) => {
  const {appConfigData} = useAppContext();
  const [productData, setProductData] = useState<EcomProduct[] | null>(null);
  const [isError, setIsError] = useState<string | null>(null);

  useEffect(() => {
    getPersonalizedContent();
  }, []);

  const getPersonalizedContent = async () => {
    try {
      const pagination = {start: 0, rows: 20};
      const searchTerm = '';
      const isSuggestive = false;
      const filter = 'Ecommerce';
      const type: any = productType;
      const userId = await StorageService.getData(storedUserID);
      const param: any = type === 'recentlyviewed' ? userId : productId;

      const contents = await fetchEcomPersonalizedProducts(
        pagination,
        searchTerm,
        isSuggestive,
        filter,
        type,
        param,
      );
      if ('data' in contents && contents?.data?.publish_fetchEcomProducts) {
        setProductData(contents?.data?.publish_fetchEcomProducts);
      } else {
        setIsError('Something went wrong!!!!'); // Set the error message
      }
    } catch (err: any) {
      console.log(err.message);
      return [] as any;
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginTop: 24,
      marginBottom: theme.cardPadding.defaultPadding,
    },
    heading: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: theme.cardMargin.left,
    },
    headingText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.secondary_text_color,
      alignSelf: 'center',
      marginBottom: 16,
    },
    seeAllText: {
      fontFamily: theme.fonts.DMSans.medium,
      fontSize: theme.fontSize.font12,
      color: appConfigData?.primary_color,
      alignSelf: 'center',
      marginBottom: 16,
    },
  });

  return (
    <>
      {productData?.[0]?.is_related && (
        <View style={styles.container}>
          <View style={styles.heading}>
            <Text style={styles.headingText}>{headingText}</Text>
            {/* <Text style={styles.seeAllText}>See all</Text> */}
          </View>
          <FlatList
            data={productData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <CategoriesItem
                data={item}
                index={index}
                mainData={productData}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
    </>
  );
};

export default FeaturedCarousel;
