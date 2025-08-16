import {ContentsResponse} from '@app/model/content';
import {APIConfig} from './ApiConfig';
import {ErrorResponse, makeApiCall} from './serviceProvider';

export default async function getHomeScreenData(
  pagination: {start: number; rows: number},
  searchTerm: string,
  tags: string[],
  filter: string,
): Promise<ContentsResponse> {
  try {
    let data = JSON.stringify({
      query: `query {
        publish_getContents(
          pagination: { start: ${pagination.start}, rows: ${pagination.rows} }
          searchTerm: "${searchTerm}"
          tags: [${tags.map(tag => `"${tag}"`).join(', ')}]
          filter: "${filter}"
        ) 
      }`,
    });

    const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
    const graphqlHeaders = APIConfig.getGraphQLHeaders();

    const response = await makeApiCall<ContentsResponse>({
      baseURL: graphqlEndpoint,
      method: 'post',
      data: data,
      headers: graphqlHeaders,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data as ContentsResponse;
  } catch (error: any) {
    // Handle any errors here
    throw {
      message: error.message,
    } as ErrorResponse;
  }
}
