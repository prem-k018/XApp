import {
  CommonActions,
  createNavigationContainerRef,
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

let queuedState: any | null = null;

export function setTopLevelNavigator(_ref: any) {
  // backward compatibility no-op
}

export function reset(state: any) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.reset(state));
  } else {
    queuedState = state;
  }
}

export function resetTo(routeName: string, params?: any) {
  reset({
    index: 0,
    routes: [{name: routeName, params}],
  });
}

export function onNavReady() {
  if (queuedState && navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.reset(queuedState));
    queuedState = null;
  }
}

// Backward‑compatibility default export (object with same API)
const NavigationService = {
  reset,
  resetTo,
  setTopLevelNavigator,
  onNavReady,
  navigationRef,
};

export default NavigationService;
