import {Alert} from 'react-native';

class AlertUtil {
  static showAlert(
    msg?: string,
    description?: string,
    OKButtonText?: string,
    onPressCallback?: () => void,
  ) {
    Alert.alert(
      msg ?? '',
      description,
      [
        {
          text: OKButtonText ?? 'OK',
          onPress: onPressCallback || (() => console.log('OK Pressed')),
        },
        {
          text: 'Cancel',
          style: 'cancel', // Optional: this styles the button for iOS
          onPress: () => console.log('Cancel Pressed'), // Optionally handle the cancel action
        },
      ],
      {cancelable: false},
    );
  }
}

export default AlertUtil;
