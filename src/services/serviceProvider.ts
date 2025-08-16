import { loginInfo, loginToken, tagListArray } from '@app/constants/constants';
import { sessionTimeout } from '@app/constants/errorCodes';
import NavigationService from '@app/navigators/navigationService';
import AlertUtil from '@app/utils/alertUtils';
import { clearCacheDataAndNavigateToLogin } from '@app/utils/HelperFunction';
import StorageService from '@app/utils/storageService';
import axios, { AxiosResponse, AxiosError } from 'axios';
import i18next from 'i18next';

let isSessionExpiredAlertShown = false; // Flag to track if the alert has been shown

export interface ErrorResponse {
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ErrorResponse;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ApiCallParams<T> {
  baseURL: string;
  method: 'get' | 'post' | 'put' | 'delete';
  data?: any;
  sendAPIToken?: boolean;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

export async function makeApiCall<T>({
  baseURL,
  method,
  data,
  sendAPIToken = true,
  headers,
  params,
}: ApiCallParams<T>): Promise<ApiResponse<T>> {
  try {
    let updatedHeaders = headers;
    if (sendAPIToken) {
      const token = await StorageService.getData(loginToken);
      updatedHeaders = {
        ...headers,
        token: `${token}`,
        'x-requested-from': 'app',
      };
    }

    console.log(
      'start==========================================================start',
    );

    console.log('baseURL ==', baseURL);
    console.log('method ==', method);
    console.log('data ==', data);
    console.log('updatedHeaders ==', updatedHeaders);
    console.log('params ==', params);

    console.log(
      'end==========================================================end',
    );

    const response: AxiosResponse<T> = await axios({
      method,
      url: baseURL,
      data,
      headers: updatedHeaders,
      params,
    });

    return { data: response.data };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401 && !isSessionExpiredAlertShown) {
        isSessionExpiredAlertShown = true;

        await StorageService.storeData(loginToken, '');
        AlertUtil.showAlert(
          i18next.t('logoutAlertMsg.sessionExpiredTitle'),
          i18next.t('logoutAlertMsg.sessionExpiredDesc'),
          i18next.t('logoutAlertMsg.buttonText'),
          async () => {
            isSessionExpiredAlertShown = false;
            clearCacheDataAndNavigateToLogin();
          },
        );
        return { error: { message: sessionTimeout } };
      }
      return { error: { message: `${axiosError.response?.status}` } };
    }
    return { error: { message: 'An unexpected error occurred.' } };
  }
}
