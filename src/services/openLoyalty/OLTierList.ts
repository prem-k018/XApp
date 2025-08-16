import { LoyaltyTierListResponse } from '@app/model/openLoyalty/OLTierList';
import { APIConfig } from '../ApiConfig';
import { ErrorResponse, makeApiCall } from '../serviceProvider';

export default async function getLoyaltyTierList(): Promise<LoyaltyTierListResponse> {
    try {
        const data = JSON.stringify({
            query: `query {
        users_getTierList {
          tierName
          isActive
          condition {
            attribute
            value
          }
          isDefault
        }
      }`,
        });

        const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
        const graphqlHeaders = APIConfig.getGraphQLHeaders();

        const response = await makeApiCall<LoyaltyTierListResponse>({
            baseURL: graphqlEndpoint,
            method: 'post',
            data: data,
            headers: graphqlHeaders,
        });

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data as LoyaltyTierListResponse;
    } catch (error: any) {
        // Handle any errors here
        throw {
            message: `Request Failed: ${error.message}`,
        } as ErrorResponse;
    }
}
