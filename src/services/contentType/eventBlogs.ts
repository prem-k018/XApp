import {APIConfig} from '../ApiConfig';
import {ErrorResponse, makeApiCall} from '../serviceProvider';
import {EventBlogs} from '@app/model/contentType/eventBlogs';

export default async function getEventBlogScreenData(
  param: string,
  pagination: {start: number; rows: number},
): Promise<EventBlogs> {
  try {
    const event_path = param;
    const start = pagination.start;
    const rows = pagination.rows;

    let data = JSON.stringify({
      query: `query ($input:publish_createBlogInput){
        publish_fetchblog(input: $input)
    }`,
      variables: {
        input: {
          event_path: event_path,
          is_published: true,
          is_soft_delete: false,
          start: start,
          rows: rows,
          sortOrder: 'desc',
          isSuggestive: false,
          pageSearch: '',
        },
      },
    });

    const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
    const graphqlHeaders = APIConfig.getGraphQLHeaders();

    const response = await makeApiCall<EventBlogs>({
      baseURL: graphqlEndpoint,
      method: 'post',
      data: data,
      headers: graphqlHeaders,
    });

    console.log(response);

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data as EventBlogs;
  } catch (error: any) {
    // Handle any errors here
    throw {
      message: `Request Failed: ${error.message}`,
    } as ErrorResponse;
  }
}