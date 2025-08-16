import { APIConfig } from '../ApiConfig';
import { ErrorResponse, makeApiCall } from '../serviceProvider';

export default async function getContentDetail(
    param?: string,
    type?: string,
): Promise<any> {
    try {
        const pagePath = param;
        const contentType = type;
        let data = JSON.stringify({
            query: `query FETCH_CONTENT_DETAIL($pagePath: String!, $contentType: publish_ContentTypes!) {
        publish_contentDetail(pagePath: $pagePath, contentType: $contentType)
      }`,
            variables: {
                pagePath: pagePath,
                contentType: contentType
            }
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
