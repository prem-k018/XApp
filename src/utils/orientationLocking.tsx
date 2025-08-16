import React, {useEffect, ReactNode} from 'react';
import Orientation from 'react-native-orientation-locker';

interface OrientationLockingProps {
  children: ReactNode;
}

const OrientationLocking: React.FC<OrientationLockingProps> = ({children}) => {
  useEffect(() => {
    Orientation.lockToPortrait();

    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  return <>{children}</>;
};

export default OrientationLocking;
