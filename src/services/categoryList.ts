import {EcommerceCategories} from '@app/model/categoryList';
import {APIConfig} from './ApiConfig';
import {ErrorResponse, makeApiCall} from './serviceProvider';

export default async function getCategoryListData(): Promise<EcommerceCategories> {
  try {
    let data = JSON.stringify({
      query: `query{
        publish_getEcommerceCategories(
            pagination:{start:0,rows:50},
            filter:[],
            searchTerm:"")
            }`,
    });

    const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
    const graphqlHeaders = APIConfig.getGraphQLHeaders();

    const response = await makeApiCall<EcommerceCategories>({
      baseURL: graphqlEndpoint,
      method: 'post',
      data: data,
      headers: graphqlHeaders,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data as EcommerceCategories;
  } catch (error: any) {
    // Handle any errors here
    throw {
      message: `Request Failed: ${error.message}`,
    } as ErrorResponse;
  }
}
