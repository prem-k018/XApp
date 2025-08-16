import { APIConfig } from '../ApiConfig';
import { ErrorResponse, makeApiCall } from '../serviceProvider';

export default async function getAssignReward(
    rewardId?: string,
    memberId?: string,
    isPoints?: boolean,
    quantity?: number,
    dateValid?: string,
    type?: string
): Promise<any> {
    try {
        let data = JSON.stringify({
            query: `mutation {
   users_assignRewards(
     rewardId: "${rewardId}"
     memberId: "${memberId}"
     isPoints: ${isPoints}
     quantity: ${quantity}
     dateValid: "${dateValid}"
     type: "${type}"

     ){
        message
     }
}
`,
        });

        const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
        const graphqlHeaders = APIConfig.getGraphQLHeaders();

        const response = await makeApiCall<any>({
            baseURL: graphqlEndpoint,
            method: 'post',
            data: data,
            headers: graphqlHeaders,
        });

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data as any;
    } catch (error: any) {
        // Handle any errors here
        throw {
            message: `Request Failed: ${error.message}`,
        } as ErrorResponse;
    }
}
