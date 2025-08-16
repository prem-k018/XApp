export type ProductDetails = {
  data: {
    publish_fetchEcomProductDetails: Product;
  };
};

export type Product = {
  ecomx_doc_type: string;
  ecomx_key: string;
  ecomxx_created_at: string;
  ecomxx_last_modified_at: string;
  ecomx_product_type: string;
  attr_categories: {
    name: string;
    id: string;
  }[];
  ecomx_sku: string;
  ecomx_variant_id: string;
  ecomx_currency_code: string;
  ecomx_list_price: string;
  ecomx_sale_price: string;
  attr_images: string[];
  ecomx_attributes_video_url: string;
  ecomx_in_stock: string;
  ecomx_quantity: string;
  id: string;
  ecomx_name: string;
  ecomx_slug: string;
  ecomx_desc: string;
  attribute: {
    ecomx_attributes_brand?: Attribute;
    ecomx_attributes_mainseller?: Attribute;
    ecomx_attributes_mainsellerhost?: Attribute;
    ecomx_attributes_warrantyterm?: Attribute;
    ecomx_attributes_warrantyduration?: Attribute;
    ecomx_attributes_category?: Attribute;
    ecomx_attributes_channel?: Attribute;
    ecomx_attributes_lineitemcustomtypeid?: Attribute;
    ecomx_attributes_product_360_url?: Attribute;
    ecomx_attributes_product_360_title?: Attribute;
    [key: string]: Attribute | undefined;
  };
  ecomx_attributes_brand?: string;
  ecomx_attributes_mainseller?: string;
  ecomx_attributes_mainsellerhost?: string;
  ecomx_attributes_warrantyterm?: string;
  ecomx_attributes_warrantyduration?: string;
  ecomx_attributes_category?: string;
  ecomx_attributes_channel?: string;
  ecomx_attributes_lineitemcustomtypeid?: string;
  ecomx_attributes_product_360_url?: string;
  ecomx_attributes_product_360_title?: string;
};

export type Attribute = {
  label: string;
  value: string[];
};
