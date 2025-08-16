import { APIConfig } from '../ApiConfig';
import { ErrorResponse, makeApiCall } from '../serviceProvider';
import { LeaderBoardListResponse } from '@app/model/openLoyalty/OLLeaderBoardList';

export default async function getOLLeaderBoardList(
    campaignId?: string,
    param?: string,
): Promise<LeaderBoardListResponse> {
    try {
        let data = JSON.stringify({
            query: `query {
    users_getLeaderBoardList(
        campaignId:"${campaignId}",
        userEmail:"${param}"
    ){
        rank
        userName
        email
        totalPoints
        isCurrentUser
    }
}`,
        });

        const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
        const graphqlHeaders = APIConfig.getGraphQLHeaders();

        const response = await makeApiCall<LeaderBoardListResponse>({
            baseURL: graphqlEndpoint,
            method: 'post',
            data: data,
            headers: graphqlHeaders,
        });

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data as LeaderBoardListResponse;
    } catch (error: any) {
        // Handle any errors here
        throw {
            message: `Request Failed: ${error.message}`,
        } as ErrorResponse;
    }
}
