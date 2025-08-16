import { UserProfileResponse } from '@app/model/profile/userProfile';
import { APIConfig } from '../ApiConfig';
import { ErrorResponse, makeApiCall } from '../serviceProvider';

export default async function getUserProfileData(
    param: string,
): Promise<UserProfileResponse> {
    try {
        let data = JSON.stringify({
            query: `query{
    publish_viewProfile( user_id: "${param}"
    )
     {
        user_id
        dob
        gender
        username
        enabled
        first_name
        last_name
        email
        timezone
        image
        phone
        role
        default_site
        preferred_sites_languages
        accessible_sites
        preferred_sites_urls
        loyalty_card_number
        member_id
        }

    }`,
        });

        const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
        const graphqlHeaders = APIConfig.getGraphQLHeaders();

        const response = await makeApiCall<UserProfileResponse>({
            baseURL: graphqlEndpoint,
            method: 'post',
            data: data,
            headers: graphqlHeaders,
        });

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data as UserProfileResponse;
    } catch (error: any) {
        // Handle any errors here
        throw {
            message: `Request Failed: ${error.message}`,
        } as ErrorResponse;
    }
}
