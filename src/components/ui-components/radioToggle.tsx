import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';

type Option = {
  label: string;
  value: string;
};

export type Props = {
  options: Option[];
  onSelect: (value: string) => void;
  initialSelected?: string;
  gap: number;
  disabled?: boolean;
};

const RadioToggle: React.FC<Props> = ({
  options,
  onSelect,
  initialSelected,
  gap,
  disabled,
}) => {
  const {appConfigData} = useAppContext();
  const [selectedOption, setSelectedOption] = useState<string>(
    initialSelected || options[0]?.value,
  );

  const handleSelect = (value: string) => {
    setSelectedOption(value);
    onSelect(value);
  };

  const styles = StyleSheet.create({
    details: {
      flex: 1,
      fontFamily: theme.fonts.DMSans.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
    },
    addressView: {
      flexDirection: 'row',
      gap: theme.cardMargin.xSmall,
    },
    circle: {
      height: 20,
      width: 20,
      borderWidth: theme.border.borderWidth,
      borderColor: appConfigData?.secondary_text_color,
      borderRadius: 20 / 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dot: {
      height: 10,
      width: 10,
      backgroundColor: appConfigData?.secondary_text_color,
      borderRadius: 10 / 2,
    },
  });

  return (
    <View style={{gap: gap}}>
      {options.map(option => (
        <TouchableOpacity
          key={option.value}
          activeOpacity={1}
          onPress={() => !disabled && handleSelect(option.value)}
          style={[styles.addressView]}>
          <View
            style={[
              styles.circle,
              selectedOption !== option.value && {borderColor: '#CED3D9'},
            ]}>
            {selectedOption === option.value && <View style={styles.dot} />}
          </View>
          <Text style={styles.details}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RadioToggle;
