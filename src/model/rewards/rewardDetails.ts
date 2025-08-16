export type RewardCategory = {
    name: string;
    id: string;
};

export type RewardActivity = {
    all_time: boolean;
    from: string;
    to: string;
};

export type RewardVisibility = {
    all_time: boolean;
    from: string;
    to: string;
};

export type RewardImage = {
    image: string;
    type: string;
};

export type RewardDetails = {
    reward_name: string;
    reward_id: string;
    reward_type: string;
    rewards_desc: string;
    is_active: boolean;
    cost_in_points: string;
    price: string;
    usage_limit: string;
    images: RewardImage[];
    activity: RewardActivity;
    visibility: RewardVisibility;
    days_inactive: string;
    date_valid: string;
    categories: RewardCategory[];
    coupon_value: string;
    coupon_value_type: string;
    conditions_description: string;
    usage_instruction: string;
    brand_description: string;
    brand_name: string;
};

export type RewardDetailsResponse = {
    data: {
        users_getRewardDetails: RewardDetails;
    }
};
