export type CartItem = {
  data: {
    publish_addProductToCart: {
      statusCode: number;
      msg: string;
      line_item_id: string;
      cart_state: string;
      cart_id: string;
      cartId: string;
      order_id: string;
      order_number: string;
    };
  };
};

export type RemoveLineItem = {
  data: {
    publish_removeLineItem: {
      statusCode: number;
      msg: string;
      cart_state: string;
      cart_id: string;
    };
  };
};

export type UpdateLineItem = {
  data: {
    publish_updateLineItem: {
      statusCode: number;
      msg: string;
      cart_state: string;
      cart_id: string;
      line_item_id: string;
    };
  };
};

export type CartCategory = {
  name: string;
  id: string;
};

export type CartLineItem = {
  ecomx_sku: string;
  ecomx_state: string;
  ecomx_currency_code: string;
  ecomx_list_price: string;
  ecomx_sale_price: string;
  attr_images: string[];
  ecomx_in_stock: boolean;
  ecomx_stock_quantity: number;
  total_price: string;
  discounted_price: string;
  id: string;
  product_id: string;
  ecomx_key: string;
  ecomx_name: string;
  ecomx_slug: string;
  ecomxx_added_at: string;
  ecomx_last_modified_at: string;
  ecomx_product_type: string;
  ecomx_quantity: number;
  ecomx_price_mode: string;
  ecomx_line_item_mode: string;
  ecomx_taxed_price_portions: any[];
  attr_categories: CartCategory[];
  ecomx_attributes_lineitemcustomtypeid: string;
  ecomx_attributes_brand: string;
  ecomx_attributes_mainseller: string;
  ecomx_attributes_mainsellerhost: string;
  ecomx_attributes_warrantyterm: string;
  ecomx_attributes_warrantyduration: string;
  ecomx_attributes_category: string;
  ecomx_attributes_channel: string;
};

export type Address = {
  title: string;
  last_name: string;
  street_name: string;
  postal_code: string;
  city: string;
  state: string;
  country: string;
  mobile: string;
  email: string;
  additional_address_info: string;
};

export type CartData = {
  line_item: CartLineItem[];
  id: string;
  created_at: string;
  last_modified_at: string;
  cart_state: string;
  shipping_mode: string;
  shipping_address: Address;
  billing_address: Address;
  currency_code: string;
  total_price: string;
  total_net_amount: string;
  total_gross_amount: string;
  total_tax: string;
  original_order_subtotal: number;
  discount_on_total_price: number;
  assign_coupon_id: string;
  discounted_incl_tax: number;
  subtotal_gross: number;
};

export type CartItemList = {
  data: {
    publish_getCartItems: {
      statusCode: number;
      message: string;
      data: CartData;
    };
  };
};
