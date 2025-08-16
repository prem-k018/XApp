import { TransactionRewardsResponse } from '@app/model/productPurchase/transactionReward';
import { APIConfig } from '../ApiConfig';
import { ErrorResponse, makeApiCall } from '../serviceProvider';

export default async function getTransactionReward(param: string): Promise<TransactionRewardsResponse> {
    try {
        const data = JSON.stringify({
            query: `query{
  users_getTransactionRewards(documentId: "${param}"){
    rewardList{
      reward_name
      reward_id
      issued_reward_id
      issued_coupon{
            value_type
            coupon_code
            value
            active_from
            active_to
            used_at
      }
    }pointsList{
      points
      type
      comment
    }
  }
}`,
            });

        const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
        const graphqlHeaders = APIConfig.getGraphQLHeaders();

        const response = await makeApiCall<TransactionRewardsResponse>({
            baseURL: graphqlEndpoint,
            method: 'post',
            data: data,
            headers: graphqlHeaders,
        });

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data as TransactionRewardsResponse;
    } catch (error: any) {
        // Handle any errors here
        throw {
            message: `Request Failed: ${error.message}`,
        } as ErrorResponse;
    }
}
