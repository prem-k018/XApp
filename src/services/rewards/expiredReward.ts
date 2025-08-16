import { APIConfig } from '../ApiConfig';
import { ErrorResponse, makeApiCall } from '../serviceProvider';
import { PointsToExpireResponse } from '@app/model/rewards/expiredReward';

export default async function getExpiredReawardList(
    param: string,
    pagination: { start: number; rows: number },
    filterTerm?: any,
    searchTerm?: string,
): Promise<PointsToExpireResponse> {
    try {
        let data = JSON.stringify({
            query: `query {
    users_pointsToExpire(
        memberId: "${param}"
        pagination: { start:${pagination.start}, rows: ${pagination.rows}}
        sort: ${filterTerm}
        filter:{
            search:"${searchTerm}"
        }
    ){
        pointsList{
            point_id
            point_desc
            created_at
            expires_at
            points
            type

        },
        total {
            filtered
        }
    }
}
`,
        });

        const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
        const graphqlHeaders = APIConfig.getGraphQLHeaders();

        const response = await makeApiCall<PointsToExpireResponse>({
            baseURL: graphqlEndpoint,
            method: 'post',
            data: data,
            headers: graphqlHeaders,
        });

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data as PointsToExpireResponse;
    } catch (error: any) {
        // Handle any errors here
        throw {
            message: `Request Failed: ${error.message}`,
        } as ErrorResponse;
    }
}
