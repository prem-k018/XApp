import { SiteSettingsResponse } from '@app/model/globalSetting';
import { APIConfig } from './ApiConfig';
import { ErrorResponse, makeApiCall } from './serviceProvider';

export default async function getGlobalSettings(
    param?: string,
): Promise<SiteSettingsResponse> {
    try {
        const pagePath = param;
        let data = JSON.stringify({
            query: `query FETCH_GLOBALSETTINGS($pagePath: String!) {
    publish_fetchSiteSettings(pagePath: $pagePath, contentType: MultiSiteSettings) {
      site_assigned_content_types
      site_assigned_tags
      loyalty_explained_cta
      promo_content
      disable_my_stories
      loyalty_explained_text
    }
  }
`,
            variables: {
                pagePath: pagePath
            }
        });

        const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
        const graphqlHeaders = APIConfig.getGraphQLHeaders();

        const response = await makeApiCall<SiteSettingsResponse>({
            baseURL: graphqlEndpoint,
            method: 'post',
            data: data,
            headers: graphqlHeaders,
        });

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data as SiteSettingsResponse;
    } catch (error: any) {
        // Handle any errors here
        throw {
            message: `Request Failed: ${error.message}`,
        } as ErrorResponse;
    }
}
