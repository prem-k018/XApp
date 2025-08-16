import {APIConfig} from '../ApiConfig';
import {ErrorResponse, makeApiCall} from '../serviceProvider';
import StorageService from '@app/utils/storageService';
import {olToken} from '@app/constants/constants';
import {AddOLPoints, OLMembers, OLToken} from '@app/model/openLoyalty/openLoyltyMembers';

export async function getOLToken(
  username: string = 'aatish.koul@hcl.com',
  password: string = 'Qwaszx@123.',
): Promise<OLToken> {
  try {
    const restApiEndpoint =
      APIConfig.getRestApiOpenLoyaltyEndpoint() + '/admin/login_check';

    const graphqlHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const response = await makeApiCall<OLToken>({
      baseURL: restApiEndpoint,
      sendAPIToken: false,
      method: 'post',
      data: {username, password},
      headers: graphqlHeaders,
    });

    if (response.data?.token) {
      await StorageService.storeData(olToken, response.data?.token);
    }

    if (response.error) {
      throw new Error(response.error.message);
    }
    return response.data as OLToken;
  } catch (error: any) {
    throw {message: `Request Failed: ${error.message}`} as ErrorResponse;
  }
}

export async function openLoyaltyAddPoint(): Promise<AddOLPoints> {
  try {
    await getOLToken();
    let storedOLToken = await StorageService.getData(olToken);

    const restApiEndpoint =
      APIConfig.getRestApiOpenLoyaltyEndpoint() + '/DEFAULT/points/add';

    const graphqlHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      Authorization: `Bearer ${storedOLToken}`,
    };

    const response = await makeApiCall<AddOLPoints>({
      baseURL: restApiEndpoint,
      sendAPIToken: false,
      method: 'post',
      data: {
        transfer: {
          customer: '6ce49312-20ee-4b0f-ac71-71defbc1b1af',
          comment: '',
          points: '6',
          walletCode: 'default',
        },
      },
      headers: graphqlHeaders,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }
    return response.data as AddOLPoints;
  } catch (error: any) {
    throw {message: `Request Failed: ${error.message}`} as ErrorResponse;
  }
}

export async function getOLMembers(): Promise<OLMembers> {
  try {
    await getOLToken();
    let storedOLToken = await StorageService.getData(olToken);

    const restApiEndpoint =
      APIConfig.getRestApiOpenLoyaltyEndpoint() + '/DEFAULT/member';

    const graphqlHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      Authorization: `Bearer ${storedOLToken}`,
    };

    const response = await makeApiCall<OLMembers>({
      baseURL: restApiEndpoint,
      sendAPIToken: false,
      method: 'get',
      headers: graphqlHeaders,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }
    return response.data as OLMembers;
  } catch (error: any) {
    throw {message: `Request Failed: ${error.message}`} as ErrorResponse;
  }
}
