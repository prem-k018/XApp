export type IssuedCoupon = {
    value_type: string;
    coupon_code: string;
    active_from: string;
    value: number;
    active_to: string;
    used_at: string;
}

export type IssuedReward = {
    reward_name: string;
    reward_id: string;
    issued_reward_id: string;
    reward_type: string;
    status: string;
    user_id: string;
    user_name: string;
    user_email: string;
    issued_coupon: IssuedCoupon;
}

export type Total = {
    filtered: number;
}

export type UsersGetMemberIssuedRewardList = {
    rewardList: IssuedReward[];
    total: Total;
}

export type RewardsResponse = {
    data: {
        users_getMemberIssuedRewardList: UsersGetMemberIssuedRewardList;
    };
}
