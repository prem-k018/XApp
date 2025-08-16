import { APIConfig } from "../ApiConfig";
import { ErrorResponse, makeApiCall } from "../serviceProvider";

export async function triggerCustomEvents(param: any): Promise<any> {
    try {
        const input = param
        let data = JSON.stringify({
            query: `mutation triggerCustomEvents($input: users_customEventReq!) {
              users_triggerCustomEvents(input: $input) {
                customEventId
                message
              }
            }`,
            variables: {
              input
            },
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
            message: `Request Failed Prem: ${error.message}`,
        } as ErrorResponse;
    }
}