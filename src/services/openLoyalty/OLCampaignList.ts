import { CampaignListResponse } from '@app/model/openLoyalty/OLCampaignList';
import { APIConfig } from '../ApiConfig';
import { ErrorResponse, makeApiCall } from '../serviceProvider';

export default async function getCampaignList(pagination: { start: number; rows: number }, isLeaderBoard?: any): Promise<CampaignListResponse> {
    try {
        const data = JSON.stringify({
            query: `query{
    users_getCampaignList(
     pagination: { start: ${pagination.start}, rows: ${pagination.rows} }
    sort: asc
    filter: {
      isLeaderboard: ${isLeaderBoard ?? false}
    }
    ){
        campaignName
        campaignId
        isActive
        startsAt
        endsAt
        imageUrl
        destinationUrl
        pointsEarns
    }
    }`,
        });

        const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
        const graphqlHeaders = APIConfig.getGraphQLHeaders();

        const response = await makeApiCall<CampaignListResponse>({
            baseURL: graphqlEndpoint,
            method: 'post',
            data: data,
            headers: graphqlHeaders,
        });

        if (response.error) {
            throw new Error(response.error.message);
        }
        return response.data as CampaignListResponse;
    } catch (error: any) {
        // Handle any errors here
        throw {
            message: `Request Failed: ${error.message}`,
        } as ErrorResponse;
    }
}
