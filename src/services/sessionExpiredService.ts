import { loginToken } from "@app/constants/constants";
import { clearCacheDataAndNavigateToLogin } from "@app/utils/HelperFunction";
import StorageService from "@app/utils/storageService";
import i18next from "i18next";
import { Alert } from "react-native";

async function showSessionExpiredAlert() {
    await StorageService.storeData(loginToken, '');

    Alert.alert(
        i18next.t('logoutAlertMsg.sessionExpiredTitle'),
        i18next.t('logoutAlertMsg.sessionExpiredDesc'),
        [
            {
                text: i18next.t('logoutAlertMsg.buttonText'),
                onPress: async () => {
                    await clearCacheDataAndNavigateToLogin();
                },
            },
        ],
        { cancelable: false }
    );
}

export { showSessionExpiredAlert };
