import { EcomOrderDetailsResponse } from '@app/model/productPurchase/orderDetail';
import { APIConfig } from '../ApiConfig';
import { ErrorResponse, makeApiCall } from '../serviceProvider';

export default async function getEcomOrderDetail(param: string): Promise<EcomOrderDetailsResponse> {
    try {
        const data = JSON.stringify({
            query: `query { 
                        publish_fetchEcomOrderDetails(orderId:"${param}")
                    }`,
            });

        const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
        const graphqlHeaders = APIConfig.getGraphQLHeaders();

        const response = await makeApiCall<EcomOrderDetailsResponse>({
            baseURL: graphqlEndpoint,
            method: 'post',
            data: data,
            headers: graphqlHeaders,
        });

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data as EcomOrderDetailsResponse;
    } catch (error: any) {
        // Handle any errors here
        throw {
            message: `Request Failed: ${error.message}`,
        } as ErrorResponse;
    }
}
