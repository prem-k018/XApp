import { AddOrRemoveCouponResponse } from '@app/model/rewards/addOrRemoveCoupon';
import { APIConfig } from '../ApiConfig';
import { ErrorResponse, makeApiCall } from '../serviceProvider';

export default async function addOrRemoveCoupon(
    cartId: string,
    memberId: string,
    couponCode: string,
    issuedRewardId: string,
    status: string,
    assignCouponId?: string,
): Promise<AddOrRemoveCouponResponse> {
    try {
        let data = JSON.stringify({
            query: `mutation {
    publish_addOrRemoveCoupon(
        cartId: "${cartId}",
        memberId: "${memberId}",
        couponCode: "${couponCode}",
        issuedRewardId: "${issuedRewardId}",
        status: "${status}",
        ${assignCouponId ? `assignCouponId:"${assignCouponId}",` : ''}
    )
}
`,
        });

        const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
        const graphqlHeaders = APIConfig.getGraphQLHeaders();

        const response = await makeApiCall<AddOrRemoveCouponResponse>({
            baseURL: graphqlEndpoint,
            method: 'post',
            data: data,
            headers: graphqlHeaders,
        });

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data as AddOrRemoveCouponResponse;
    } catch (error: any) {
        // Handle any errors here
        throw {
            message: `Request Failed: ${error.message}`,
        } as ErrorResponse;
    }
}
