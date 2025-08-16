import { AppConfigData } from '@app/model/appConfig';
import { ErrorResponse, makeApiCall } from './serviceProvider';
import { GeoLocationData } from '@app/model/geoLocationData';

export default async function fetchAppConfig(): Promise<AppConfigData> {
  try {
    // Import the JSON data from the local file using a relative path
    const localData: AppConfigData = require('@app/resource/Configuration.json');
    return localData;
  } catch (localError) {
    console.error(
      'Failed to load configuration data from the local file:',
      localError,
    );
    throw new Error('Both API and local file loading failed');
  }
}

export async function getGeoLocationData(): Promise<GeoLocationData> {
  try {
    const restApiEndpoint =
      'https://api.ipgeolocation.io/ipgeo/?apiKey=892b590647004e7fa3e910456ec34e8c';

    const response = await makeApiCall<GeoLocationData>({
      baseURL: restApiEndpoint,
      sendAPIToken: false,
      method: 'get',
    });

    if (response.error) {
      throw new Error(response.error.message);
    }
    console.log("GeoLocation Data ===> ", response.data)
    return response.data as GeoLocationData;
  } catch (error: any) {
    throw { message: `Request Failed: ${error.message}` } as ErrorResponse;
  }
}
