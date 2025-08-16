export type RewardCategory = {
    name: string;
    id: string;
};

export type RewardImage = {
    image: string;
    type: string;
};

export type Reward = {
    reward_name: string;
    reward_id: string;
    reward_type: string;
    rewards_desc: string;
    isActive: boolean;
    start_at: string;
    ends_at: string;
    cost_in_points: number;
    price: number;
    usage_limit: number;
    images: RewardImage[];
    brand_description: string;
    brand_name: string;
    conditions_description: string;
    usage_instruction: string;
    categories: RewardCategory[];
};

export type UsersGetMemberRewardList = {
    rewardList: Reward[];
    total: {
        all: number;
        filtered: number;
        estimated: boolean;
    };
};

export type MemberRewardList = {
    data: {
        users_getMemberRewardList: UsersGetMemberRewardList;
    };
};
