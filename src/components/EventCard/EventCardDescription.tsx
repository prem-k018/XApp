/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import {Linking, StyleSheet, View, useWindowDimensions} from 'react-native';
import React, {memo} from 'react';
import {theme} from '@app/constants';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {useAppContext} from '@app/store/appContext';
export type Props = {
  description: string;
};

const EventCardDescription: React.FC<Props> = ({description}) => {
  const {appConfigData} = useAppContext();
  const dynamicText = description;
  const dynamicFontFamily = theme.fonts.Inter.regular;
  const dynamicColor = appConfigData?.secondary_text_color;
  const fontSize = theme.fontSize.font16;
  const topPadding = 26;
  const lineHeight = 24.5;
  const endsWithBr = description.endsWith('<br><br>');
  const htmlContent = `
    <div style="font-family: '${dynamicFontFamily}'; color: ${dynamicColor}; font-size: ${fontSize}px; line-height: ${lineHeight}px; padding-top: ${topPadding}px; padding-bottom: ${
    endsWithBr ? 0 : 26
  }px">
      ${dynamicText}
    </div>
    <style> div {height: auto !important}
            img { max-width: 100%; height: auto !important; }
            video { max-width: 100%; height: auto !important;}</style>
  `;
  /*
    Notes on the style tag added at the end of htmlContent
      The height autos help keep height: 100% set elsewhere from bugging out. It is
      somewhat inconsistent, I'm not sure all height: 100% cause issues, but in many cases it causes
      content to stretch (I believe infinitely) which might have to do with how AutoHeightWebView
      dynamically adjusts height.
      The max-width: 100% keeps certain elements that might by default stray past the content width
      set in the style prop. It might not be an extensive list, other tags besides img/video might
      also cause the content to extend past the width and introduce scrolling in the webview, needs to
      be checked.
  */

  const {width} = useWindowDimensions();

  return (
    <View style={styles.descriptionContainer}>
      <View style={styles.borderLine} />
      {/* <RenderHTML
        source={{html: htmlContent}}
        tagsStyles={tagsStyle}
        contentWidth={width - 30}
        enableExperimentalBRCollapsing={true}
      /> */}
      <AutoHeightWebView
        source={{html: htmlContent}}
        // The opacity 0.99 styling is a hack fix for articleDetails with webview on android
        // sometimes crashing with no error message when scrolling. The hack is found from here:
        // https://github.com/react-native-webview/react-native-webview/issues/811
        // The actual issue, I believe, somehow involves hardware acceleration on android and the
        // fact that cases where content is layered and "other situation where alpha compositing
        // would be required to re-draw the view on each frame" causes something somewhere to (I'm guessing)
        // perform too many operations and crash. This theory is based on the above issue where I got the hack
        // from and these other sources.
        // https://developer.android.com/topic/performance/hardware-accel
        // https://reactnative.dev/docs/performance#moving-a-view-on-the-screen-scrolling-translating-rotating-drops-ui-thread-fps
        // I do not yet have a proper solution to these issues so the opacity 0.99 fix will have to do
        // for the time being
        style={{width: width - 30, opacity: 0.99, overflow: 'hidden'}}
        containerStyle={styles.webview}
        scrollEnabled={false}
        originWhitelist={['*']}
        onShouldStartLoadWithRequest={event => {
          console.log('URL ' + event.url);
          if (event.url !== 'about:blank') {
            Linking.openURL(event.url);
            return false;
          }
          return true;
        }}
      />
      {/* <WebView
        source={{html: htmlContent}}
        style={{width: width - 30, height: 500}}
      /> */}
      <View style={styles.borderLine} />
    </View>
  );
};

export default memo(EventCardDescription);

const styles = StyleSheet.create({
  descriptionContainer: {
    paddingHorizontal: theme.cardPadding.defaultPadding,
    flex: 1,
  },
  webview: {
    // paddingLeft: 40,
    // paddingRight: 40,
  },
  borderLine: {
    borderBottomColor: theme.colors.grayScale4,
    borderBottomWidth: theme.border.borderWidth,
    marginTop: 0,
  },
});
