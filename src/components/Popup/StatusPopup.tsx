import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';
import screensUtils from '@app/utils/screensUtils';
import {icons} from '@app/assets/icons';

export type Props = {
  data: any;
  visible: boolean;
  onClose: () => void;
  isLoading: boolean;
};

const StatusPopup: React.FC<Props> = ({visible, data, onClose, isLoading}) => {
  const {appConfigData} = useAppContext();

  const screenWidth = screensUtils.screenWidth;
  const containerWidth =
    screenWidth - (theme.cardPadding.mediumSize + theme.cardPadding.mediumSize);

  const styles = StyleSheet.create({
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    popupContainer: {
      width: containerWidth,
      height: containerWidth - 50,
      backgroundColor: appConfigData?.primary_text_color,
      borderRadius: theme.border.borderRadius,
      paddingHorizontal: 24,
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.cardPadding.mediumSize,
      alignSelf: 'center',
    },
    cancelIcon: {
      position: 'absolute',
      top: theme.cardPadding.defaultPadding,
      right: theme.cardPadding.defaultPadding,
    },
    innerCircle: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 58,
      width: 58,
      borderRadius: 58 / 2,
      backgroundColor:
        data?.status === 'success'
          ? theme.colors.globalGreen
          : theme.colors.red,
    },
    rightIcon: {
      tintColor: appConfigData?.primary_text_color,
      height: 40,
      width: 40,
    },
    title: {
      fontFamily: theme.fonts.HCLTechRoobert.medium,
      fontSize: theme.fontSize.font20,
      color: appConfigData?.secondary_text_color,
      textAlign: 'center',
    },
    desc: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.secondary_text_color,
      textAlign: 'center',
    },
    loading: {
      alignSelf: 'center',
    },
  });

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.popupContainer}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={onClose}
            style={styles.cancelIcon}>
            <Image
              source={icons.cross}
              tintColor={appConfigData?.secondary_text_color}
            />
          </TouchableOpacity>
          {isLoading ? (
            <ActivityIndicator
              color={appConfigData?.primary_color}
              size={'large'}
              style={styles.loading}
            />
          ) : (
            <>
              <View style={styles.innerCircle}>
                {data?.status === 'success' ? (
                  <Image source={icons.right} style={styles.rightIcon} />
                ) : (
                  <Image source={icons.alertInfo} />
                )}
              </View>
              <Text style={styles.title}>{data.topic} !!!</Text>
              <Text style={styles.desc}>{data?.message}</Text>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default StatusPopup;
