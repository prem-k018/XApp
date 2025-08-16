import { APIConfig } from '../ApiConfig';
import { ErrorResponse, makeApiCall } from '../serviceProvider';
import { UserOLProfileData } from '@app/model/profile/userOLProfile';

export default async function getUserOLProfileData(
    param?: string,
): Promise<UserOLProfileData> {
    try {
        let data = JSON.stringify({
            query: `query {
  users_userOLProfile(
   memberId:"${param}"
  ) {
    userProfileInfo {
      firstName
      lastName
      loyaltyCardNumber
      referalCode
    }
    userPointsInfo {
      totalEarnedPoints
      activePoints
      spentPoints
      expiredPoints
      thisMonth
      lastMonth
      convertedPoints
    }
    userCurrentTier
    dailyProgress
  }
}
`,
        });

        const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
        const graphqlHeaders = APIConfig.getGraphQLHeaders();

        const response = await makeApiCall<UserOLProfileData>({
            baseURL: graphqlEndpoint,
            method: 'post',
            data: data,
            headers: graphqlHeaders,
        });

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data as UserOLProfileData;
    } catch (error: any) {
        // Handle any errors here
        throw {
            message: `Request Failed: ${error.message}`,
        } as ErrorResponse;
    }
}
