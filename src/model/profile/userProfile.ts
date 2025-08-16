export type UserProfileResponse = {
    data: {
        publish_viewProfile: UserProfile;
    };
    errors: Error[];
};

export type UserProfile = {
    user_id: string;
    dob: string;
    gender: string;
    username: string;
    enabled: boolean;
    first_name: string;
    last_name: string;
    email: string;
    timezone: string;
    image: string;
    phone: string;
    role: string | null;
    default_site: string;
    preferred_sites_languages: {
        [key: string]: string;
    };
    accessible_sites: string[];
    preferred_sites_urls: {
        [key: string]: string;
    };
    loyalty_card_number: string;
    member_id: string
}

export type Error = {
    message: string;
    code: string;
};