export type AttrCategory = {
  name: string;
  id: string;
};

export type EcomProduct = {
  id: string;
  ecomx_doc_type: string;
  ecomx_key: string;
  ecomxx_created_at: string;
  ecomxx_last_modified_at: string;
  ecomx_product_type: string;
  attr_categories: AttrCategory[];
  ecomx_sku: string;
  ecomx_variant_id: string;
  ecomx_currency_code: string;
  ecomx_list_price: string;
  ecomx_sale_price: string;
  attr_images: string[];
  ecomx_in_stock: string;
  ecomx_quantity: string;
  ecomx_name: string;
  ecomx_slug: string;
  ecomx_desc: string;
  attribute: Record<string, any>; 
  is_related?: boolean
};

export type FetchEcomProductsResponse = {
  data: {
    publish_fetchEcomProducts: EcomProduct[];
  };
};
