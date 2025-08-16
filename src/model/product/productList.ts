export type AttrCategory = {
  name: string;
  id: string;
};

export type Product = {
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
  ecomx_attributes_special_feature: string;
  ecomx_attributes_brand: string;
  line_item_id: string;
  added_quanity: number;

  attribute: {
    special_feature: string;
  };
};

export type Error = {
  message: string;
  code: string;
};

export type ProductList = {
  data: {
    publish_getEcommerceProducts: {
      products: Product[];
      total_records: number;
    };
  };
  errors: Error[];
};
