import {theme} from '@app/constants';
import {Content} from '@app/model/content';
import {useAppContext} from '@app/store/appContext';
import {loadImageForHomePage} from '@app/utils/imageLinkUtils';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
} from 'react-native';
import FastImage from 'react-native-fast-image';

type DefaultStoryProps = {
  item: Content;
  dimensions: {width: number; height: number};
  handlePress: ({nativeEvent}: GestureResponderEvent) => void;
};

const DefaultStory = (props: DefaultStoryProps) => {
  const result = loadImageForHomePage(props.item);
  const {appConfigData} = useAppContext();

  const styles = StyleSheet.create({
    fixed: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingHorizontal: theme.cardPadding.defaultPadding,
      paddingBottom: 22,
    },
    title: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      color: appConfigData?.primary_text_color,
      fontSize: theme.fontSize.font28,
    },
  });

  return (
    <>
      <FastImage
        style={styles.fixed}
        source={{
          uri: result.value,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <Pressable onPress={props.handlePress}>
        <View
          style={[
            {
              width: props.dimensions.width,
              height: props.dimensions.height,
            },
            styles.container,
          ]}>
          <Text style={styles.title} numberOfLines={4}>
            {props.item.Title}
          </Text>
        </View>
      </Pressable>
    </>
  );
};

export default DefaultStory;
