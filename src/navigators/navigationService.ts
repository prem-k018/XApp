import {CommonActions, NavigationContainerRef} from '@react-navigation/native';
import React from 'react';

type RootStackParamList = {
  // Define your stack screens here
  Login: undefined;
  // Add other screens as needed
};

class NavigationService {
  private static navigationRef: React.RefObject<
    NavigationContainerRef<RootStackParamList>
  > = React.createRef();

  static setTopLevelNavigator(
    ref: React.RefObject<NavigationContainerRef<RootStackParamList>>,
  ) {
    if (ref) {
      this.navigationRef = ref;
    }
  }

  static navigate(routeName: keyof RootStackParamList, params?: any) {
    if (this.navigationRef.current) {
      this.navigationRef.current.navigate(routeName, params);
    }
  }

  static reset(state: {index: number; routes: {name: string}[]}) {
    if (this.navigationRef.current) {
      this.navigationRef.current.dispatch(CommonActions.reset(state));
    }
  }
}

export default NavigationService;
