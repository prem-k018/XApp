export type CampaignListResponse = {
    data: {
        users_getCampaignList: Campaign[];
    };
};

export type Campaign = {
    campaignName: string;
    campaignId: string;
    isActive: boolean;
    startsAt: string;
    endsAt: string;
    ponitsEarns: number;
    imageUrl: string;
    destinationUrl: string;
};
