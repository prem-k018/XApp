export type Category = {
  id: string;
  docType: string;
  name: string;
  description: string;
  slug: string;
  parent_id: string;
};

export type EcommerceCategories = {
  data: {
    publish_getEcommerceCategories: Category[];
  };
};
