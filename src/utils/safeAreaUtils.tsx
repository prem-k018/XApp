import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

class SafeAreaUtils {
  static getSafeAreaInsets(): SafeAreaInsets {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const insets = useSafeAreaInsets();
    return insets;
  }

  static getSafeAreaFrame() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const frame = useSafeAreaFrame();
    return frame;
  }
}

export default SafeAreaUtils;
