import { APIConfig } from './ApiConfig';
import { ErrorResponse, makeApiCall } from './serviceProvider';
import { MyStoriesReponse } from '@app/model/myStories';

export default async function getMyStoriesData(
    pagination: { start: number; rows: number },
    searchTerm: string,
    tags: string[],
    cdpFilter: string[],
    filter: string,
    isSuggestive: boolean,
): Promise<MyStoriesReponse> {
    try {
        const pagePath = `{ 
            pagination: {
              start: ${pagination.start}, 
              rows: ${pagination.rows}
            },
            searchTerm: "${searchTerm}",
            tags: [${tags.map((tag: string) => `"${tag}"`).join(',')}],
            cdpFilter: [${cdpFilter.map((filter: string) => `"${filter}"`).join(',')}],
            filter: "${filter}",
            isSuggestive: ${isSuggestive}
          }`;

        let data = JSON.stringify({
            query: `query fetchEcomProducts($pagePath: String!) {
          publish_fetchEcomProducts(queryParam: $pagePath)
        }`,
            variables: {
                pagePath: pagePath,
            }
        });

        const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
        const graphqlHeaders = APIConfig.getGraphQLHeaders();

        const response = await makeApiCall<MyStoriesReponse>({
            baseURL: graphqlEndpoint,
            method: 'post',
            data: data,
            headers: graphqlHeaders,
        });

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data as MyStoriesReponse;
    } catch (error: any) {
        // Handle any errors here
        throw {
            message: `Request Failed: ${error.message}`,
        } as ErrorResponse;
    }
}
