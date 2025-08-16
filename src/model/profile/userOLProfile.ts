export type UserProfileInfo = {
    firstName: string;
    lastName: string;
    loyaltyCardNumber: string;
    referalCode: string;
};

export type UserPointsInfo = {
    totalEarnedPoints: number;
    activePoints: number;
    spentPoints: number;
    expiredPoints: number;
    thisMonth: number;
    lastMonth: number;
    convertedPoints: number;
};

export type UserOLProfileData = {
    data: {
        users_userOLProfile: {
            userProfileInfo: UserProfileInfo;
            userPointsInfo: UserPointsInfo;
            userCurrentTier: string;
            dailyProgress: number;
        };
    };
};