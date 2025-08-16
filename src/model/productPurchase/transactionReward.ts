export type IssuedCoupon = {
    value_type: string;
    coupon_code: string;
    value: number;
    active_from: string;
    active_to: string;
    used_at: string;
};

export type Reward = {
    reward_name: string;
    reward_id: string;
    issued_reward_id: string;
    issued_coupon: IssuedCoupon;
};

export type Points = {
    points: number;
    type: string;
    comment: string;
};

export type TransactionRewards = {
    rewardList: Reward[];
    pointsList: Points[];
};

export type TransactionRewardsResponse = {
    data: {
        users_getTransactionRewards: TransactionRewards;
    };
};
