import { FetchEcomProductsResponse } from '@app/model/product/personalizedContent';
import { APIConfig } from '../ApiConfig';
import { ErrorResponse, makeApiCall } from '../serviceProvider';

export default async function fetchEcomPersonalizedProducts(
  pagination: { start: number; rows: number },
  searchTerm: string,
  isSuggestive: boolean,
  filter: string,
  type: string,
  param: string,
): Promise<FetchEcomProductsResponse> {
  try {
    const queryParam = JSON.stringify({
      pagination: {
        start: pagination.start,
        rows: pagination.rows,
      },
      searchTerm: searchTerm,
      tags: [],
      filter: filter,
      isSuggestive: isSuggestive,
      ecommerceRequest: {
        filter: [],
      },
      productId: type === 'recentlyviewed' ? undefined : param,
      userId: type === 'recentlyviewed' ? param : undefined,
      type: type,
    });

    let data = JSON.stringify({
      query: `query {
        publish_fetchEcomProducts(
          queryParam: "${queryParam.replace(/"/g, '\\"')}"
        )
      }`,
    });

    const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
    const graphqlHeaders = APIConfig.getGraphQLHeaders();

    const response = await makeApiCall<FetchEcomProductsResponse>({
      baseURL: graphqlEndpoint,
      method: 'post',
      data: data,
      headers: graphqlHeaders,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data as FetchEcomProductsResponse;
  } catch (error: any) {
    // Handle any errors here
    throw {
      message: `Request Failed: ${error.message}`,
    } as ErrorResponse;
  }
}
