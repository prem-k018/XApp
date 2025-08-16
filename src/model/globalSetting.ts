export type SiteSettingsResponse = {
    data: {
        publish_fetchSiteSettings: SiteSettings;
    };
};

export type SiteSettings = {
    site_assigned_content_types: string[];
    site_assigned_tags: string[];
    loyalty_explained_cta: LoyaltyCTA;
    promo_content: PromoContent[];
    disable_my_stories: boolean;
    loyalty_explained_text: string;
};

export type LoyaltyCTA = {
    Page: string;
    Title: string;
};

export type PromoContent = {
    Title: string;
    Id: string;
};
