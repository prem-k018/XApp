import {LoyaltyPoints} from '@app/model/openLoyalty/loyaltyPoints';
import {APIConfig} from '../ApiConfig';
import {makeApiCall, ErrorResponse} from '../serviceProvider';
import {
  CartItem,
  CartItemList,
  RemoveLineItem,
  UpdateLineItem,
} from '@app/model/productPurchase/cartManagement';

export default async function addProductToCart(
  initialize?: boolean,
  cartId?: string,
  productId?: string,
  variantId?: number,
  quantity?: number,
  address?: {
    shipping_address?: any,
    billing_address?: any,
  },
  userId?: string,
  cartTotal?: string,
  paymentMethod?: string,
  points?: string,
  memberId?: string,
  pointConversionAmount?: string,
  placeOrder?: boolean,
): Promise<CartItem> {
  console.log(address);
  try {
    let addressQuery = '';
    if (address?.shipping_address) {
      addressQuery = `
        shipping_address:{
          title : "${address.shipping_address.title}",
          last_name:"${address.shipping_address.last_name}",
          street_name:"${address.shipping_address.street_name}",
          postal_code:"${address.shipping_address.postal_code}",
          email:"${address.shipping_address.email}",
          additional_address_info:"${address.shipping_address.additional_address_info}",
          mobile:"${address.shipping_address.mobile}",
          city:"${address.shipping_address.city}",
          state : "${address.shipping_address.state}",
          country : "${address.shipping_address.country}"
        }
      `;
    }

    if (address?.billing_address) {
      addressQuery = `
        billing_address:{
          title : "${address.billing_address.title}",
          last_name:"${address.billing_address.last_name}",
          street_name:"${address.billing_address.street_name}",
          postal_code:"${address.billing_address.postal_code}",
          email:"${address.billing_address.email}",
          additional_address_info:"${address.billing_address.additional_address_info}",
          mobile:"${address.billing_address.mobile}",
          city:"${address.billing_address.city}",
          state : "${address.billing_address.state}",
          country : "${address.billing_address.country}"
        }
      `;
    }

    let data = JSON.stringify({
      query: `mutation {
        publish_addProductToCart(
          input: {
            ${initialize ? 'initialize:true,' : ''}
            ${cartId ? `cart_id:"${cartId}",` : ''}
            ${
              productId && variantId && quantity
                ? `line_item:{product_id: "${productId}", variant_id: ${variantId}, quantity: ${quantity}},`
                : ''
            }
            ${addressQuery ? `address:{${addressQuery}},` : ''}
            ${userId ? `user_id:"${userId}",` : ''}
            ${cartTotal ? `cart_total:"${cartTotal}",` : ''}
            ${paymentMethod ? `payment_method:"${paymentMethod}",` : ''}
            ${points ? `points: "${points}",` : ''}
            ${memberId ? `member_id: "${memberId}",` : ''}
            ${pointConversionAmount ? `point_conversion_amount: "${pointConversionAmount}",` : ''}
            ${placeOrder ? 'place_order:true,' : ''}
          }
        )
      }`,
    });

    const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
    const graphqlHeaders = APIConfig.getGraphQLHeaders();

    const response = await makeApiCall<CartItem>({
      baseURL: graphqlEndpoint,
      method: 'post',
      data: data,
      headers: graphqlHeaders,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    console.log(response.data);

    return response.data as CartItem;
  } catch (error: any) {
    // Handle any errors here
    throw {
      message: error.message,
    } as ErrorResponse;
  }
}

export async function removeLineItemFromCart(
  cart_id?: string,
  line_item_id?: string,
): Promise<RemoveLineItem> {
  try {
    let data = JSON.stringify({
      query: `mutation {
        publish_removeLineItem(
          input: {
            ${cart_id ? `cart_id:"${cart_id}",` : ''}
            ${line_item_id ? `line_item_id:"${line_item_id}",` : ''}
          }
        )
      }`,
    });

    const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
    const graphqlHeaders = APIConfig.getGraphQLHeaders();

    const response = await makeApiCall<RemoveLineItem>({
      baseURL: graphqlEndpoint,
      method: 'post',
      data: data,
      headers: graphqlHeaders,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    console.log(response.data);

    return response.data as RemoveLineItem;
  } catch (error: any) {
    // Handle any errors here
    throw {
      message: error.message,
    } as ErrorResponse;
  }
}

export async function updateLineItem(
  cart_id?: string,
  line_item_id?: string,
  quantity?: number,
): Promise<UpdateLineItem> {
  try {
    let data = JSON.stringify({
      query: `mutation {
        publish_updateLineItem(
          input: {
            ${cart_id ? `cart_id:"${cart_id}",` : ''}
            ${line_item_id ? `line_item_id:"${line_item_id}",` : ''}
            ${quantity ? `quantity:${quantity},` : ''}
          }
        )
      }`,
    });

    const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
    const graphqlHeaders = APIConfig.getGraphQLHeaders();

    const response = await makeApiCall<UpdateLineItem>({
      baseURL: graphqlEndpoint,
      method: 'post',
      data: data,
      headers: graphqlHeaders,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    console.log(response.data);

    return response.data as UpdateLineItem;
  } catch (error: any) {
    // Handle any errors here
    throw {
      message: error.message,
    } as ErrorResponse;
  }
}

export async function getCartItemList(cart_id?: string): Promise<CartItemList> {
  try {
    let data = JSON.stringify({
      query: `query {
        publish_getCartItems(
            ${cart_id ? `cartId:"${cart_id}",` : ''}
        )
      }`,
    });

    const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
    const graphqlHeaders = APIConfig.getGraphQLHeaders();

    const response = await makeApiCall<CartItemList>({
      baseURL: graphqlEndpoint,
      method: 'post',
      data: data,
      headers: graphqlHeaders,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    console.log(response.data);

    return response.data as CartItemList;
  } catch (error: any) {
    // Handle any errors here
    throw {
      message: error.message,
    } as ErrorResponse;
  }
}

export async function getLoyaltyPoints(amount: string): Promise<LoyaltyPoints> {
  try {
    const restApiEndpoint = APIConfig.getRestApiLoyaltyEndpoint();

    const response = await makeApiCall<LoyaltyPoints>({
      baseURL: restApiEndpoint + `?amount=${amount}`,
      sendAPIToken: false,
      method: 'get',
    });

    if (response.error) {
      throw new Error(response.error.message);
    }
    return response as LoyaltyPoints;
  } catch (error: any) {
    throw {message: `Request Failed: ${error.message}`} as ErrorResponse;
  }
}
