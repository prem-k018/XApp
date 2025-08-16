import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useAppContext} from '@app/store/appContext';
import {theme} from '@app/constants';
import screensUtils from '@app/utils/screensUtils';
import {icons} from '@app/assets/icons';
import {images} from '@app/assets/images';
import {RewardDetails} from '@app/model/rewards/rewardDetails';
import LinearGradient from 'react-native-linear-gradient';
import StorageService from '@app/utils/storageService';
import {userMemberId} from '@app/constants/constants';
import getAssignReward from '@app/services/rewards/redeemReward';
import StatusPopup from './StatusPopup';

export type Props = {
  data: RewardDetails;
  visible: boolean;
  onClose: () => void;
  selectedValue: any;
  onSpinWheelClose: () => void;
};

const SpinWheelResult: React.FC<Props> = ({
  data,
  visible,
  onClose,
  selectedValue,
  onSpinWheelClose,
}) => {
  const {appConfigData} = useAppContext();
  const [message, setMessage] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmPopup, setConfirmPopup] = useState<boolean>(false);
  const [isError, setIsError] = useState<string | null>(null);

  const screenWidth = screensUtils.screenWidth;
  const containerWidth =
    screenWidth - (theme.cardPadding.mediumSize + theme.cardPadding.mediumSize);

  const getRedemptionReward = async () => {
    try {
      setIsLoading(true);
      const rewardId = data?.reward_id;
      const memberId: any = await StorageService.getData(userMemberId);
      const isPoints = true;
      const quantity = 1;
      const dateValid = data?.date_valid;
      const type = 'static_coupon';
      const contents = await getAssignReward(
        rewardId,
        memberId,
        isPoints,
        quantity,
        dateValid,
        type,
      );
      if (contents?.data?.users_assignRewards) {
        const newData = contents.data.users_assignRewards;
        setMessage({
          topic: 'Redemption Successful',
          message: newData.message,
          status: 'success',
        });
        setConfirmPopup(true);
        setIsLoading(false);
      } else {
        const msg = contents.errors[0]?.message;
        setMessage({
          topic: 'Redemption Unsuccessful',
          message: msg,
          status: 'fail',
        });
        setConfirmPopup(true);
      }
    } catch (error: any) {
      setIsError(error.message);
      setMessage({
        topic: 'Redemption Unsuccessful',
        message:
          'Oops! Something went wrong with your redemption. Please try again, or contact support if the issue persists.',
        status: 'fail',
      });
      setConfirmPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimReward = () => {
    getRedemptionReward();
  };

  const handleStatusClose = () => {
    if (message.status === 'success') {
      setConfirmPopup(false);
      onClose();
      onSpinWheelClose();
    } else {
      setConfirmPopup(false);
    }
  };

  const handleClose = () => {
    onClose();
    onSpinWheelClose();
  };

  const styles = StyleSheet.create({
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    popupContainer: {
      width: containerWidth,
      backgroundColor: appConfigData?.primary_text_color,
      borderRadius: theme.border.borderRadius,
      paddingHorizontal: theme.cardMargin.left,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      paddingTop: theme.cardPadding.xLargeSize,
      paddingBottom: theme.cardPadding.largeSize,
    },
    cancelIcon: {
      position: 'absolute',
      top: theme.cardPadding.defaultPadding,
      right: theme.cardPadding.defaultPadding,
    },
    image: {
      justifyContent: 'center',
      alignItems: 'center',
      gap: theme.cardPadding.mediumSize,
      height: 'auto',
      width: 'auto',
    },
    title: {
      fontFamily: theme.fonts.HCLTechRoobert.medium,
      fontSize: theme.fontSize.font24,
      color: appConfigData?.secondary_text_color,
      textAlign: 'center',
    },
    desc: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      fontSize: theme.fontSize.font14,
      color: appConfigData?.secondary_text_color,
      textAlign: 'center',
    },
    loading: {
      height: '64%',
      alignSelf: 'center',
    },
    rewardContainer: {
      marginHorizontal: theme.cardPadding.carMargin,
      padding: theme.cardPadding.smallXsize,
      backgroundColor: appConfigData?.primary_color,
      borderRadius: theme.border.borderRadius,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dottedBorderContainer: {
      borderRadius: theme.border.borderRadius,
      borderWidth: theme.border.borderWidth,
      borderStyle: 'dashed',
      borderColor: appConfigData?.primary_text_color,
      paddingHorizontal: theme.cardPadding.largeSize,
      paddingVertical: theme.cardPadding.xLargeSize,
      gap: theme.cardPadding.largeSize,
    },
    text: {
      fontFamily: theme.fonts.HCLTechRoobert.regular,
      fontSize: theme.fontSize.font18,
      color: appConfigData?.primary_text_color,
      textAlign: 'center',
    },
    rewardText: {
      fontFamily: theme.fonts.HCLTechRoobert.semiBold,
      fontSize: theme.fontSize.font20,
      color: appConfigData?.primary_text_color,
    },
    couponText: {
      fontFamily: theme.fonts.HCLTechRoobert.medium,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.primary_text_color,
      padding: 6,
      borderRadius: theme.border.borderRadius,
      borderWidth: theme.border.borderWidth,
      borderStyle: 'dashed',
      borderColor: appConfigData?.primary_text_color,
      marginHorizontal: theme.cardPadding.mediumSize,
      textAlign: 'center',
    },
    button: {
      width: 165,
      backgroundColor: appConfigData?.primary_color,
      paddingVertical: 12,
      borderRadius: theme.border.borderRadius,
    },
    redeemText: {
      fontFamily: theme.fonts.DMSans.semiBold,
      fontSize: theme.fontSize.font16,
      color: appConfigData?.primary_text_color,
      textAlign: 'center',
    },
  });

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={handleClose}>
      <View style={styles.modalBackground}>
        <View style={styles.popupContainer}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleClose}
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
            <View>
              {selectedValue.label === 'Try Again!' ? (
                <View style={styles.image}>
                  <Text style={styles.title}>Sorry!</Text>
                  <Text style={styles.desc}>Better luck next time.</Text>
                  <Image
                    source={images.tryAgain}
                    style={{marginVertical: 20}}
                  />
                  <Text style={styles.desc}>
                    Keep Shopping to get more gifts.
                  </Text>
                </View>
              ) : (
                <>
                  <ImageBackground
                    source={images.spinWheelResult}
                    style={styles.image}>
                    <Text style={styles.title}>Congratulations!</Text>
                    <Text style={styles.desc}>
                      Your spin was lucky! You've earned a coupon. Hurry and
                      claim your reward now. Don't wait too long, it's only
                      available for limited time.
                    </Text>
                    <LinearGradient
                      colors={['#7ABEF7', '#4080F5', '#7747D5', '#572AC2']}
                      style={styles.rewardContainer}>
                      <View style={styles.dottedBorderContainer}>
                        <Text style={styles.text}>
                          Get{' '}
                          <Text style={styles.rewardText}>
                            {data?.coupon_value_type === 'money'
                              ? `$${data?.coupon_value}`
                              : `${data?.coupon_value}%`}
                          </Text>{' '}
                          off on your next purchase
                        </Text>
                        <Text style={styles.couponText}>
                          {data?.reward_name}
                        </Text>
                      </View>
                    </LinearGradient>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={handleClaimReward}>
                      <Text style={styles.redeemText}>Claim Now</Text>
                    </TouchableOpacity>
                  </ImageBackground>
                  {confirmPopup && (
                    <StatusPopup
                      data={message}
                      visible={confirmPopup}
                      onClose={handleStatusClose}
                      isLoading={isLoading}
                    />
                  )}
                </>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default SpinWheelResult;
