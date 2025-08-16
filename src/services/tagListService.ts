import {APIConfig} from './ApiConfig';
import {TagResponse} from '@app/model/tagList';
import {ErrorResponse, makeApiCall} from './serviceProvider';

// Create an async function to make the GraphQL request
export default async function getTagListData(
  pagination: {start: number; rows: number},
  sort: string,
): Promise<TagResponse> {
  try {
    // Define the GraphQL query

    let data = JSON.stringify({
      query: `query {
      publish_getTagsList(
        pagination: {start: ${pagination.start}, rows: ${pagination.rows}}
        sort: ${sort})
    }`,
    });

    const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
    const graphqlHeaders = APIConfig.getGraphQLHeaders();

    console.log('GRAPHQL_ENDPOINT:', graphqlEndpoint);
    console.log('graphqlQuery:', data);

    const response = await makeApiCall<TagResponse>({
      baseURL: graphqlEndpoint,
      method: 'post',
      data: data,
      headers: graphqlHeaders,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data as TagResponse;
  } catch (error: any) {
    // Handle any errors here
    throw {
      message: `Request Failed: ${error.message}`,
    } as ErrorResponse;
  }
}
