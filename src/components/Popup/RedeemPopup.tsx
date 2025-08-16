import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';
import screensUtils from '@app/utils/screensUtils';
import {Reward} from '@app/model/rewards/rewardList';
import getAssignReward from '@app/services/rewards/redeemReward';
import StatusPopup from './StatusPopup';

export type Props = {
  data?: Reward;
  visible: boolean;
  onClose: () => void;
  handleRedeem: () => void;
};

const RedeemPopup: React.FC<Props> = ({
  data,
  visible,
  onClose,
  handleRedeem,
}) => {
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
    buttonView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.cardPadding.mediumSize,
      gap: theme.cardPadding.mediumSize,
    },
    button: {
      borderRadius: theme.border.borderRadius,
      backgroundColor: theme.colors.primaryBlack,
      paddingVertical: theme.cardPadding.smallXsize,
      width: '45%',
    },
    buttonInActive: {
      borderRadius: theme.border.borderRadius,
      borderWidth: theme.border.borderWidth,
      paddingVertical: theme.cardPadding.smallXsize,
      width: '45%',
    },
    buttonInText: {
      fontFamily: theme.fonts.HCLTechRoobert.semiBold,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.primary_text_color,
      textAlign: 'center',
    },
    buttonText: {
      fontFamily: theme.fonts.HCLTechRoobert.semiBold,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
      textAlign: 'center',
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
          <Text style={styles.title}>Confirm Redemption</Text>
          <Text style={styles.desc}>
            Are you sure you want to redeem {data?.reward_name}
          </Text>
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={styles.buttonInActive}
              activeOpacity={1}
              onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={1}
              onPress={handleRedeem}>
              <Text style={styles.buttonInText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RedeemPopup;
