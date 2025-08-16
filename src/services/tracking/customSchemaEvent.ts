import { CustomEventSchemaResponse } from "@app/model/tracking/customSchemaEvent";
import { APIConfig } from "../ApiConfig";
import { ErrorResponse, makeApiCall } from "../serviceProvider";

export async function getCustomSchemaEvent(): Promise<CustomEventSchemaResponse> {
    try {
        let data = JSON.stringify({
            query: `query {
    users_getCustomEventSchemaList(
        pagination : {
            start: 1
            rows: 10
        }
        sort: desc
    ){
        eventSchemaList {
            event_type
            event_name
            event_schema {
                fields {
                    name
                    type
                    description
                }
            }
            active
            created_at
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

        const response = await makeApiCall<CustomEventSchemaResponse>({
            baseURL: graphqlEndpoint,
            method: 'post',
            data: data,
            headers: graphqlHeaders,
        });

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data as CustomEventSchemaResponse;
    } catch (error: any) {
        // Handle any errors here
        throw {
            message: `Request Failed: ${error.message}`,
        } as ErrorResponse;
    }
}