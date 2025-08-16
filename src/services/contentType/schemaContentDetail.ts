import { SchemaContentData } from "@app/model/contentType/schemaContentDetail";
import { APIConfig } from "../ApiConfig";
import { ErrorResponse, makeApiCall } from "../serviceProvider";

export default async function getSchemaContentDetail(
  param?: string,
  type?: string
): Promise<SchemaContentData> {
  try {
    const pagePath = param;
    const contentType = type;
    let data = JSON.stringify({
      query: `query FETCH_CONTENT_SCHEMA_DETAIL($contentType: String!, $pagePath: String!) {
                publish_fetchSchemaContent(contentType: $contentType, pagePath: $pagePath)
            }`,
      variables: {
        pagePath: pagePath,
        contentType: contentType,
      },
    });

    const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
    const graphqlHeaders = APIConfig.getGraphQLHeaders();

    const response = await makeApiCall<SchemaContentData>({
      baseURL: graphqlEndpoint,
      method: "post",
      data: data,
      headers: graphqlHeaders,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data as SchemaContentData;
  } catch (error: any) {
    // Handle any errors here
    throw {
      message: `Request Failed: ${error.message}`,
    } as ErrorResponse;
  }
}
