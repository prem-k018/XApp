import { MemberRewardList } from '@app/model/rewards/rewardList';
import { APIConfig } from '../ApiConfig';
import { ErrorResponse, makeApiCall } from '../serviceProvider';

export default async function getMemberReawardList(
    param: string,
    pagination: { start: number; rows: number },
    filterTerm?: any,
    searchTerm?: string,
    rewardType?: string,
    category?: string
): Promise<MemberRewardList> {
    try {
        let data = JSON.stringify({
            query: `query {
    users_getMemberRewardList(memberId:"${param}",
    pagination: { start: ${pagination.start}, rows: ${pagination.rows} }
    sort: ${filterTerm},
    filter:{search:"${searchTerm}", reward_type: "${rewardType}", category: "${category}"}
    )
}
`,
        });

        const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
        const graphqlHeaders = APIConfig.getGraphQLHeaders();

        const response = await makeApiCall<MemberRewardList>({
            baseURL: graphqlEndpoint,
            method: 'post',
            data: data,
            headers: graphqlHeaders,
        });

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data as MemberRewardList;
    } catch (error: any) {
        // Handle any errors here
        throw {
            message: `Request Failed: ${error.message}`,
        } as ErrorResponse;
    }
}
