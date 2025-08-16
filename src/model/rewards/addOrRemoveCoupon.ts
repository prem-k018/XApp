export type CouponData = {
    assign_coupon_id: string;
    discount_on_total_price: number;
};

export type AddOrRemoveCoupon = {
    statusCode: number;
    msg: string;
    data: CouponData;
};

export type AddOrRemoveCouponResponse = {
    data: {
        publish_addOrRemoveCoupon: AddOrRemoveCoupon;
    };
};
