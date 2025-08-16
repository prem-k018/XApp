import {ProvideLoyaltyPoints} from '@app/model/openLoyalty/loyaltyPoints';
import {APIConfig} from '../ApiConfig';
import {ErrorResponse, makeApiCall} from '../serviceProvider';
import StorageService from '@app/utils/storageService';
import {loyaltyPointEarned, storedUserID} from '@app/constants/constants';

// Create an async function to make the GraphQL request
export default async function providePoints(
  param: string,
): Promise<ProvideLoyaltyPoints> {
  try {
    const earned = await StorageService.getData(loyaltyPointEarned);
    if (earned) {
      const earnedObject = JSON.parse(earned);
      if (earnedObject[param]) {
        return {
          data: {
            publish_providePoints: {
              statusCode: 0,
              data: {
                message: '',
                LoyaltydPoints: 0,
              },
            },
          },
        } as ProvideLoyaltyPoints;
      }
    }

    const pointEarned = await StorageService.getData(loyaltyPointEarned);
    let pointEarnedObject: any = pointEarned ? JSON.parse(pointEarned) : {};
    pointEarnedObject[param] = true;
    await StorageService.storeData(
      loyaltyPointEarned,
      JSON.stringify(pointEarnedObject),
    );

    const userID = await StorageService.getData(storedUserID);
    let data = JSON.stringify({
      query: `mutation{
        publish_providePoints(user_id: "${userID}")
    }`,
    });

    const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
    const graphqlHeaders = APIConfig.getGraphQLHeaders();

    const response = await makeApiCall<ProvideLoyaltyPoints>({
      baseURL: graphqlEndpoint,
      method: 'post',
      data: data,
      headers: graphqlHeaders,
      sendAPIToken: false,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data as ProvideLoyaltyPoints;
  } catch (error: any) {
    // Handle any errors here
    throw {
      message: `Request Failed: ${error.message}`,
    } as ErrorResponse;
  }
}
