/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useEffect, useState} from 'react';
import AnimatedStoryBar from './animatedStoryBar';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {icons} from '@app/assets/icons';
import {theme} from '@app/constants';
import SafeAreaUtils from '@app/utils/safeAreaUtils';

type StoryBarProps = {
  index: number;
  total: number;
  thisStoryProgress: number;
  thisStoryProgressTotal: number;
  maxStoryBarWidth: number;
  storyIntervalRef: React.MutableRefObject<NodeJS.Timeout | null>;
};

export type StoryBarStatus = 'Completed' | 'Active' | 'Disabled';

const StoryBar = ({
  index,
  total,
  thisStoryProgress,
  thisStoryProgressTotal,
  maxStoryBarWidth,
  storyIntervalRef,
}: StoryBarProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const paddings = 16;
  const barGaps = 4;
  const individualBarWidth = Math.floor(
    (maxStoryBarWidth - 2 * paddings - (total - 1) * barGaps) / total,
  );

  const [bars, setBars] = useState<StoryBarStatus[]>([]);
  const safeAreaInsets = SafeAreaUtils.getSafeAreaInsets();

  useEffect(() => {
    const newBars: StoryBarStatus[] = [];
    for (let i = 0; i < total; i++) {
      if (i < index) {
        newBars.push('Completed');
      } else if (i === index) {
        newBars.push('Active');
      } else {
        newBars.push('Disabled');
      }
    }
    setBars(newBars);
  }, [index, total]);

  return (
    <View
      style={{
        position: 'absolute',
        top: safeAreaInsets.top + 16,
        width: maxStoryBarWidth,
        paddingHorizontal: paddings,
        gap: 16,
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        <TouchableOpacity
          onPress={_event => {
            clearInterval(storyIntervalRef.current ?? undefined);
            navigation.goBack();
          }}
          style={styles.iconStyle}>
          <Image source={icons.closeX} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {bars.map((bar, i) => {
          if (bar === 'Active') {
            return (
              <AnimatedStoryBar
                key={i}
                progress={thisStoryProgress / thisStoryProgressTotal}
                width={individualBarWidth}
              />
            );
          } else {
            return (
              <View
                key={i}
                style={{
                  width: individualBarWidth,
                  height: 4,
                  backgroundColor: bar === 'Completed' ? 'white' : '#FFFFFF66',
                  borderRadius: 2,
                }}
              />
            );
          }
        })}
      </View>
    </View>
  );
};

//TODO Put inline styles here
const styles = StyleSheet.create({
  iconStyle: {
    height: 24,
    width: 24,
    backgroundColor: theme.colors.headerButtonBGColor,
    borderRadius: theme.border.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StoryBar;
