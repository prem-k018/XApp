import { PollResponse } from '@app/model/contentType/poll';
import { APIConfig } from '../ApiConfig';
import {
  PollResultData,
  PollResultResponse,
  PollSaveResponse,
} from '@app/model/contentType/pollResult';
import { ErrorResponse, makeApiCall } from '../serviceProvider';

// Create an async function to make the GraphQL request
export async function getPollScreenData(param: string): Promise<PollResponse> {
  try {
    let data = JSON.stringify({
      query: `query{
    publish_fetchContent(contentType: Poll, pagePath: "${param}")
    }`,
    });
    const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
    const graphqlHeaders = APIConfig.getGraphQLHeaders();

    const response = await makeApiCall<PollResponse>({
      baseURL: graphqlEndpoint,
      method: 'post',
      data: data,
      headers: graphqlHeaders,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data as PollResponse;
  } catch (error: any) {
    // Handle any errors here
    throw {
      message: `Request Failed: ${error.message}`,
    } as ErrorResponse;
  }
}

export async function getPollResultData(
  param: string,
): Promise<PollResultResponse | ErrorResponse> {
  try {
    const title = param
    let data = JSON.stringify({
      query: `query FETCH_POLL($title: String!) {
  users_fetchContent(title: $title) {
    title
    document_path
    options
    status
    total_vote
    start_date
    end_date
    created_by
    updated_by
    createdAt
    updatedAt
    __typename
  }
}`,
      variables: {
        title: title,
      }
    });

    const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
    const graphqlHeaders = APIConfig.getGraphQLHeaders();

    const response = await makeApiCall<PollResultResponse>({
      baseURL: graphqlEndpoint,
      method: 'post',
      data: data,
      headers: graphqlHeaders,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data as PollResultResponse;
  } catch (error: any) {
    // Handle any errors here
    throw {
      message: `Request Failed: ${error.message}`,
    } as ErrorResponse;
  }
}

export default async function savePollData(
  pollData: PollResultData,
): Promise<PollSaveResponse | ErrorResponse> {
  try {
    const pollInfo = pollData
    let data = JSON.stringify({
      query: `mutation ($input: users_contentRequestModel) {
  users_saveContent(input: $input) {
    message
    __typename
  }
}`,
      variables: {
        input: {
          pollInfo: pollInfo
        },
      }
    });

    const graphqlEndpoint = APIConfig.getGraphQLEndpoint();
    const graphqlHeaders = APIConfig.getGraphQLHeaders();

    const response = await makeApiCall<PollSaveResponse>({
      baseURL: graphqlEndpoint,
      method: 'post',
      data: data,
      headers: graphqlHeaders,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data as PollSaveResponse;
  } catch (error: any) {
    // Handle any errors here
    throw {
      message: `Request Failed: ${error.message}`,
    } as ErrorResponse;
  }
}
