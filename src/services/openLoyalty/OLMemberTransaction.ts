import { MemberTransactionsResponse } from '@app/model/openLoyalty/OLMemberTransaction';
import { APIConfig } from '../ApiConfig';
import { ErrorResponse, makeApiCall } from '../serviceProvider';

export default async function getOLMemberTranactions(
    param?: string,
): Promise<MemberTransactionsResponse> {
    try {
        let data = JSON.stringify({
            query: `query {
                        users_fetchMemberTransactions(
                            pagination: {start: 1, rows: 10}
                            sort: desc
                            filter:{
                            email: "${param}"
                            }
                        ) {
                        event
                        pointsEarned
                        pointsDeducted
                        totalEventCount
                        campaignId
                        } 
                    }`,
        });

        const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
        const graphqlHeaders = APIConfig.getGraphQLHeaders();

        const response = await makeApiCall<MemberTransactionsResponse>({
            baseURL: graphqlEndpoint,
            method: 'post',
            data: data,
            headers: graphqlHeaders,
        });

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data as MemberTransactionsResponse;
    } catch (error: any) {
        // Handle any errors here
        throw {
            message: `Request Failed: ${error.message}`,
        } as ErrorResponse;
    }
}
