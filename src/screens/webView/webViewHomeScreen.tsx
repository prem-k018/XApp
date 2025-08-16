import React, {useState} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import WebView from 'react-native-webview';
import {theme} from '@app/constants';

const WebViewHomeScreen: React.FC = ({route}: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const {data} = route.params;

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <ActivityIndicator
          size="large"
          color={theme.colors.primaryBlack} // Set the color you desire
          style={styles.activityIndicator}
        />
      )}
      <WebView
        source={{
          uri: data.Id,
        }}
        style={styles.webview}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
      />
    </View>
  );
};

export default WebViewHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  activityIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -25, // Adjust the marginTop and marginLeft based on the size of your ActivityIndicator
    marginLeft: -25,
    zIndex: 1, // Ensure the ActivityIndicator is above the WebView
  },
  webview: {
    flex: 1,
  },
});
