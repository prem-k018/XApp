import {APIConfig} from '../ApiConfig';
import {ErrorResponse, makeApiCall} from '../serviceProvider';
import {ProductList} from '@app/model/product/productList';

export default async function getShopScreenData(
  pagination: {start: number; rows: number},
  searchTerm: string,
  isSuggestive: boolean,
  filter: string[],
  attributes: string[],
): Promise<ProductList> {
  try {
    let data = JSON.stringify({
      query: `query{
          publish_getEcommerceProducts(
            pagination:{start:${pagination.start}, rows:${pagination.rows}}
            searchTerm:"${searchTerm}"
            isSuggestive:${isSuggestive}
            filter:${JSON.stringify(filter)}
            attributes:${JSON.stringify(attributes)}
          )
        }`,
    });

    const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
    const graphqlHeaders = APIConfig.getGraphQLHeaders();

    const response = await makeApiCall<ProductList>({
      baseURL: graphqlEndpoint,
      method: 'post',
      data: data,
      headers: graphqlHeaders,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    console.log(response.data);

    return response.data as ProductList;
  } catch (error: any) {
    // Handle any errors here
    throw {
      message: error.message,
    } as ErrorResponse;
  }
}
