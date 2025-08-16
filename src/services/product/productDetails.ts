import {APIConfig} from '../ApiConfig';
import {ErrorResponse, makeApiCall} from '../serviceProvider';
import {ProductDetails} from '@app/model/product/productDetail';

export default async function getProductDetailScreenData(
  param: string,
): Promise<ProductDetails> {
  try {
    let data = JSON.stringify({
      query: `query{
        publish_fetchEcomProductDetails(productId: "${param}",filterAttr:[])
    }`,
    });

    const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
    const graphqlHeaders = APIConfig.getGraphQLHeaders();

    const response = await makeApiCall<ProductDetails>({
      baseURL: graphqlEndpoint,
      method: 'post',
      data: data,
      headers: graphqlHeaders,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data as ProductDetails;
  } catch (error: any) {
    // Handle any errors here
    throw {
      message: `Request Failed: ${error.message}`,
    } as ErrorResponse;
  }
}
