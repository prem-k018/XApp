export type AttributeCategory = {
    id: string;
    name: string;
};

export type LineItemCustomFields = {
    purchasedFrom: string;
    IsWarrantyRegistered: string;
    pointOfPurchase: string;
    warrantyRegisteredFrom: string;
};

export type LineItemAttributes = {
    lineItemCustomTypeId: string;
};

export type LineItem = {
    productSequenceNumber: string;
    name: string;
    quantity: number;
    price: number;
    productId: string;
    lineItemImageUrl: string;
    attr_categories: AttributeCategory[];
    attributes: LineItemAttributes;
    customFields: LineItemCustomFields;
    attr_images: string[];
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

export type Order = {
    id: string;
    createdAt: string;
    lastModifiedAt: string;
    orderNumber: string;
    customerEmail: string;
    orderState: string;
    shipmentState: string;
    paymentState: string;
    currency_code: string;
    lineItem: LineItem[];
    original_order_subtotal: number;
    discounted_incl_tax: number;
    discount_on_total_price: number;
    assign_coupon_id: string;
    total_gross_amount: number;
    total_tax: number;
    subtotal_gross: number;
    billing_address: Address;
    shippingAddress: Address;
    point_conversion_amount: string;
    points: string;
    member_id: string;
};

export type EcomOrderDetails = {
    statusCode: number;
    msg: string;
    data: Order[];
};

export type EcomOrderDetailsResponse = {
    data: {
        publish_fetchEcomOrderDetails: EcomOrderDetails;
    };
};
