import {APIConfig} from './ApiConfig';
import {LoginResponse} from '@app/model/login';
import {ErrorResponse, makeApiCall} from './serviceProvider';

export async function getLoginData(
  username: string,
  password: string,
): Promise<LoginResponse> {
  try {
    const restApiEndpoint = APIConfig.getRestApiLoginEndpoint();
    const graphqlHeaders = APIConfig.getGraphQLHeaders();

    const response = await makeApiCall<LoginResponse>({
      baseURL: restApiEndpoint,
      sendAPIToken: false,
      method: 'post',
      data: {username, password},
      headers: graphqlHeaders,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }
    return response.data as LoginResponse;
  } catch (error: any) {
    throw {message: `Request Failed: ${error.message}`} as ErrorResponse;
  }
}
