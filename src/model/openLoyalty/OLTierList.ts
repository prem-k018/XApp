export type Tier = {
    tierName: string;
    isActive: boolean;
    condition: Condition[];
    isDefault: boolean;
};

export type Condition = {
    attribute: string;
    value: number;
};

export type LoyaltyTierListResponse = {
    data: {
        users_getTierList: Tier[];
    };
};
