export type MemberTransactionsResponse = {
    data: {
        users_fetchMemberTransactions: Transaction[];
    };
};

export type Transaction = {
    event: string;
    pointsEarned: number;
    pointsDeducted: number;
    totalEventCount: number;
    campaignId: string;
};
