import { APIConfig } from '../ApiConfig';
import { ErrorResponse, makeApiCall } from '../serviceProvider';

export default async function updateUserProfile(
    userDetails: any,
): Promise<any> {
    try {
        let data = JSON.stringify({
            query: `mutation ($input: publish_updateRequest){
                        publish_updateUserProfile(input: $input) {    
                        message
                        }
                    }`,
            variables: {
                input: {
                    id: userDetails.id,
                    first_name: userDetails.first_name,
                    last_name: userDetails.last_name,
                    timezone: userDetails.timezone,
                    phone: userDetails.phone,
                    preferred_sites_languages: userDetails.preferred_sites_languages || "en",
                    dob: userDetails.dob,
                    gender: userDetails.gender,
                    enabled: userDetails.enabled,
                    default_site: userDetails.default_site,
                    accessible_sites: userDetails.accessible_sites,
                    preferred_sites_urls: userDetails.preferred_sites_languages,
                },
            },
        });

        const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
        const graphqlHeaders = APIConfig.getGraphQLHeaders();

        const response = await makeApiCall<any>({
            baseURL: graphqlEndpoint,
            method: 'post',
            data: data,
            headers: graphqlHeaders,
        });

        if (response.error) {
            throw new Error(response.error.message);
        }
        return response.data as any;
    } catch (error: any) {
        // Handle any errors here
        throw {
            message: `Request Failed: ${error.message}`,
        } as ErrorResponse;
    }
}
