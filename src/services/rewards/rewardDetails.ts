import { RewardDetailsResponse } from '@app/model/rewards/rewardDetails';
import { APIConfig } from '../ApiConfig';
import { ErrorResponse, makeApiCall } from '../serviceProvider';

export default async function getRewardDetails(
    param: string,
): Promise<RewardDetailsResponse> {
    try {
        let data = JSON.stringify({
            query: `query {
    users_getRewardDetails(
     rewardId: "${param}"
     ){ 
         reward_name
         reward_id
         reward_type
        rewards_desc
        is_active
        cost_in_points
        price
        usage_limit
        images {
            image
            type
        }
        activity {
            all_time
            from
            to
        }
        visibility {
            all_time
            from
            to
        }
        days_inactive
        date_valid
        categories {
            name
            id
        }
        coupon_value
        coupon_value_type
        conditions_description
        usage_instruction
        brand_description
        brand_name
    }
}
`,
        });

        const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
        const graphqlHeaders = APIConfig.getGraphQLHeaders();

        const response = await makeApiCall<RewardDetailsResponse>({
            baseURL: graphqlEndpoint,
            method: 'post',
            data: data,
            headers: graphqlHeaders,
        });

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data as RewardDetailsResponse;
    } catch (error: any) {
        // Handle any errors here
        throw {
            message: `Request Failed: ${error.message}`,
        } as ErrorResponse;
    }
}
