import { APIConfig } from '../ApiConfig';
import { ErrorResponse, makeApiCall } from '../serviceProvider';
import { RewardsResponse } from '@app/model/rewards/issuedRewardList';

export default async function getMemberIssuedReawardList(
    param: string,
    pagination: { start: number; rows: number },
    filterTerm?: any,
    searchTerm?: string,
    status?: any,
    rewardType?: string,
    category?: string,
): Promise<RewardsResponse> {
    try {
        let data = JSON.stringify({
            query: `query {
    users_getMemberIssuedRewardList(memberId:"${param}",
    pagination: {start: ${pagination.start}, rows:${pagination.rows}},
    sort:${filterTerm}
    filter:{search:"${searchTerm}", status: ${status}, reward_type: "${rewardType}", category: "${category}"}
    ){
    rewardList {
        reward_name
        reward_id
        issued_reward_id
        reward_type
        status
        user_id
        user_name
        user_email
        issued_coupon {
            value_type
            coupon_code
            active_from
            value
            active_to
            used_at
        }
    }
    total {
        filtered
    }
    }
    }
`,
        });

        const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
        const graphqlHeaders = APIConfig.getGraphQLHeaders();

        const response = await makeApiCall<RewardsResponse>({
            baseURL: graphqlEndpoint,
            method: 'post',
            data: data,
            headers: graphqlHeaders,
        });

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data as RewardsResponse;
    } catch (error: any) {
        // Handle any errors here
        throw {
            message: `Request Failed: ${error.message}`,
        } as ErrorResponse;
    }
}
