import {RouteProp} from '@react-navigation/native';

export type TabBarIconPropsType = {
  focused: boolean;
  color: string;
  size: number;
  route?: RouteProp<any>;
};
