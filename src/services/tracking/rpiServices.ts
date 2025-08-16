import {APIConfig, RPI_CLIENT_ID, RPI_VIEW_NAME} from '../ApiConfig';
import {UserData} from '@app/model/login';
import {ErrorResponse, makeApiCall} from '../serviceProvider';
import {CreateVisitorData, VisitorData} from '@app/model/tracking/rpiData';
import {GeoLocationData} from '@app/model/geoLocationData';
import StorageService from '@app/utils/storageService';
import uuid from 'react-native-uuid';
import {
  addTocart,
  button,
  cartCheckOut,
  customSchemaEvent,
  environment,
  geoLocation,
  makePayment,
  productView,
  siteHost,
  storedUserID,
  userEmail,
  videoView,
  view,
} from '@app/constants/constants';
import DeviceInfo from 'react-native-device-info';
import {triggerCustomEvents} from './triggerCustomEvent';

export async function checkVisitorData(
  visitorID: string,
): Promise<VisitorData> {
  try {
    const restApiEndpoint = APIConfig.getRestApiRPIEndpoint();
    const rpiHeaders = APIConfig.getRPIApiHeaders();

    const response = await makeApiCall<VisitorData>({
      baseURL:
        restApiEndpoint +
        `/Cache/Visitors/${RPI_CLIENT_ID}/Views/${RPI_VIEW_NAME}`,
      sendAPIToken: false,
      method: 'post',
      data: {
        Identity: {
          VisitorID: visitorID,
        },
      },
      headers: rpiHeaders,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }
    return response.data as VisitorData;
  } catch (error: any) {
    throw {message: `Request Failed: ${error.message}`} as ErrorResponse;
  }
}

export async function createVisitorData(
  visitorID: string,
  selectedTags: string,
  geoLocation?: GeoLocationData,
  userInfo?: UserData,
): Promise<CreateVisitorData> {
  try {
    const restApiEndpoint = APIConfig.getRestApiRPIEndpoint();
    const rpiHeaders = APIConfig.getRPIApiHeaders();

    const payload = {
      isNewVisitor: false,
      visitorId: visitorID,
      deviceId: 'AnonymousDeviceID',
      pagePublishedId: 0,
      visitorAttributes: [
        {
          name: 'env',
          value: APIConfig.environment,
          updateOperator: 0,
        },
        {
          name: 'userName',
          value: userInfo ? userInfo.name : 'NA',
          updateOperator: 0,
        },
        {
          name: 'emailId',
          value: userInfo ? userInfo.email_id : 'NA',
          updateOperator: 0,
        },
        {
          name: 'userId',
          value: userInfo ? userInfo.user_id : 'NA',
          updateOperator: 0,
        },
        {
          name: 'mobileNumber',
          value: 'NA',
          updateOperator: 0,
        },
        {
          name: 'gender',
          value: userInfo ? userInfo.gender : 'NA',
          updateOperator: 0,
        },
        {
          name: 'geo_country',
          value: geoLocation ? geoLocation.country_name : 'NA',
          updateOperator: 0,
        },
        {
          name: 'geo_country_code',
          value: geoLocation ? geoLocation.country_code3 : 'NA',
          updateOperator: 0,
        },
        {
          name: 'geo_region',
          value: geoLocation ? geoLocation.time_zone.name : 'NA',
          updateOperator: 0,
        },
        {
          name: 'geo_city',
          value: geoLocation ? geoLocation.city : 'NA',
          updateOperator: 0,
        },
        {
          name: 'geo_zipcode',
          value: geoLocation ? geoLocation.zipcode : 'NA',
          updateOperator: 0,
        },
        {
          name: 'deviceType',
          value: 'Mobile',
          updateOperator: 0,
        },
        {
          name: 'tags',
          value: selectedTags,
          updateOperator: 0,
        },
      ],
      pageReferrer: 'https://rpi-server-1.hcl-x.com/',
      requestURL: 'https://rpi-server-1.hcl-x.com/',
      clientId: RPI_CLIENT_ID,
      geolocation: {
        longitude: 'NA',
        latitude: 'NA',
        searchString: 'NA',
      },
      interactionTracking: {
        channelExecutionId: 0,
        rpContactId: 'NA',
      },
      viewName: RPI_VIEW_NAME,
      trackingMode: 0,
    };

    const response = await makeApiCall<CreateVisitorData>({
      baseURL: restApiEndpoint + '/Cache/Visit',
      sendAPIToken: false,
      method: 'post',
      data: payload,
      headers: rpiHeaders,
    });

    console.log('CreateVisitorData', response);

    if (response.error) {
      throw new Error(response.error.message);
    }
    return response.data as CreateVisitorData;
  } catch (error: any) {
    throw {message: `Request Failed: ${error.message}`} as ErrorResponse;
  }
}

export async function addEventForTracking(
  data: any,
): Promise<CreateVisitorData> {
  try {
    const geoLocationValue = await StorageService.getData(geoLocation);
    const geoLocationData = JSON.parse(geoLocationValue as any) || {};
    const schemaValue = await StorageService.getData(customSchemaEvent);
    const schemaData = JSON.parse(schemaValue as any) || [];
    const restApiEndpoint = APIConfig.getRestApiRPIEndpoint();
    const rpiHeaders = APIConfig.getRPIApiHeaders();
    const userID = await StorageService.getData(storedUserID);
    const user_email = await StorageService.getData(userEmail);
    const site_name = await StorageService.getData(siteHost);
    const environment_name = await StorageService.getData(environment);
    const user_agent = await DeviceInfo.getUserAgent();
    const getUniqueImpressionId = () => {
      const user = userID ?? 'anonymous'; // Identifier for web traffic
      const timestamp = Date.now(); // Current time in milliseconds
      return `${uuid.v4()}-${timestamp}-${user}-app`;
    };
     
    const validScreenTypes = [
      addTocart,
      cartCheckOut,
      makePayment,
      productView,
    ];
    console.log(
      data.screenType,
      'data.screenType22',
      data.screenType ==
        (addTocart || cartCheckOut || makePayment || productView),
    );

    const metadata = [
      {
        name: 'action',
        value:
          data.screenType == view
            ? 'page_view'
            : data.screenType == addTocart
            ? 'add_to_cart'
            : data.screenType == cartCheckOut
            ? 'cart_checkout'
            : data.screenType == makePayment
            ? 'make_payment'
            : data.screenType == productView
            ? 'product_view'
            : data.screenType == videoView
            ? getEventAction(data.videoAction)
            : 'button_click',
      },
      {
        name: data.screenType == button ? 'container_type' : 'content_type',
        value: validScreenTypes.includes(data.screenType)
          ? 'ecom'
          : data.content_type ?? 'Screen',
      },
      {
        name: 'language',
        value: 'en',
      },
      {
        name: 'created_datetime',
        value: new Date().toISOString().slice(0, -5) + 'Z',
      },
      {
        name: 'channel',
        value: 'app',
      },

      {
        name: 'site_host',
        value: site_name,
      },
      {
        name: 'env_name',
        value: environment_name,
      },
      {
        name: 'visitorId',
        value: userID ? userID : 'NA',
      },
      {
        name: 'device_type',
        value: 'Mobile',
      },
      {
        name: 'user_agent',
        value: `${
          user_agent + 
          ', ' +
          DeviceInfo.getBrand() +
          ' ' +
          DeviceInfo.getModel()
        }`,
      },
      {
        name: 'content_status',
        value: 'free',
      },
      {
        name: 'geo_country',
        value: geoLocationData?.country_name,
      },
      {
        name: 'geo_country_code',
        value: geoLocationData?.country_code3,
      },
      {
        name: 'geo_region',
        value: geoLocationData?.state_prov,
      },
      {
        name: 'geo_city',
        value: geoLocationData?.city,
      },
      {
        name: 'geo_zipcode',
        value: geoLocationData?.zipcode,
      },
      {
        name: "thumb_impression",
        value: getUniqueImpressionId()
      },
    ];
    if (
      validScreenTypes.includes(data.screenType) &&
      data?.ecomx_attributes_category != undefined
    ) {
      metadata.push({
        name: 'product_category',
        value: data?.ecomx_attributes_category
          ? data?.ecomx_attributes_category
          : '',
      });
    }

    if (data.screenType !== view && data.screenType !== videoView) {
      metadata.push({
        name: 'page_name',
        value: data?.screenType,
      });
    }

    if (data.screenType === videoView) {
      const pageUrl = `https://${site_name}/en/${data.content_type.toLowerCase()}${
        data?.contentData?.page_url
      }`;
      metadata.push({
        name: 'author',
        value: data?.contentData?.author,
      });
      metadata.push({
        name: 'card_name',
        value: data?.contentData?.title,
      });
      metadata.push({
        name: 'destination_url',
        value: pageUrl,
      });
      metadata.push({
        name: 'page_name',
        value: data?.pageName,
      });
      metadata.push({
        name: 'tag',
        value: `${data?.tags}`,
      });
      metadata.push({
        name: 'page_url',
        value: pageUrl,
      });
      metadata.push({
        name: 'media_id',
        value: data?.mediaId,
      });
      metadata.push({
        name: 'media_type',
        value: 'video',
      });
      metadata.push({
        name: 'stream_time',
        value: `${data?.streamDuration}`,
      });
      metadata.push({
        name: 'media_length',
        value: `${data?.videoDuration}`,
      });
    }

    if (data.screenType == button) {
      metadata.push({
        name: 'button_name',
        value: data?.button_name,
      });
    }

    if (data.screenType == addTocart) {
      metadata.push({
        name: 'product_Id',
        value: data?.id,
      });
      metadata.push({
        name: 'product_name',
        value: data?.ecomx_name,
      });
      metadata.push({
        name: 'product_quantity',
        value: 1,
      });
      metadata.push({
        name: 'product_price_per_unit',
        value: data?.ecomx_list_price,
      });
      metadata.push({
        name: 'currency',
        value: data?.ecomx_currency_code,
      });
      metadata.push({
        name: 'total_value',
        value: data?.ecomx_sale_price,
      });
    }

    if (data.screenType == productView) {
      metadata.push({
        name: 'product_id',
        value: data?.id,
      });
      metadata.push({
        name: 'product_name',
        value: data?.ecomx_name,
      });
      metadata.push({
        name: 'product_quantity',
        value: 1,
      });
      metadata.push({
        name: 'product_price_per_unit',
        value: data?.ecomx_list_price,
      });
      metadata.push({
        name: 'currency',
        value: data?.ecomx_currency_code,
      });
      metadata.push({
        name: 'total_value',
        value: data?.ecomx_sale_price,
      });
    }

    if (data.screenType == cartCheckOut) {
      metadata.push({
        name: 'cart_total_items',
        value: data?.cart_total_Items,
      });
      metadata.push({
        name: 'cart_id',
        value: data?.cart_id,
      });
      metadata.push({
        name: 'cart_total_amount',
        value: data?.cart_total_amount,
      });
      metadata.push({
        name: 'currency',
        value: data?.currency,
      });
      metadata.push({
        name: 'cart_list',
        value: JSON.stringify(data.products),
      });
    }

    if (data.screenType == makePayment) {
      metadata.push({
        name: 'transaction_Id',
        value: data?.transaction_Id,
      });
      metadata.push({
        name: 'cart_id',
        value: data?.cart_id,
      });

      metadata.push({
        name: 'payment_method',
        value: data?.payment_method,
      });
      metadata.push({
        name: 'shipping_address',
        value: data?.shipping_address,
      });
      metadata.push({
        name: 'shipping_email',
        value: data?.shipping_email,
      });
      metadata.push({
        name: 'shipping_phone_number',
        value: data?.shipping_phone_number,
      });

      metadata.push({
        name: 'billing_address',
        value: data?.billing_address,
      });
      metadata.push({
        name: 'billing_email',
        value: data?.billing_email,
      });
      metadata.push({
        name: 'billing_phone_number',
        value: data?.billing_phone_number,
      });

      metadata.push({
        name: 'order_number',
        value: data?.order_id,
      });
      metadata.push({
        name: 'cart_total_Items',
        value: data?.cart_total_Items,
      });
      metadata.push({
        name: 'shipping_cost',
        value: data?.shipping_cost,
      });
      metadata.push({
        name: 'estimated_tax',
        value: data?.estimated_tax,
      });
      metadata.push({
        name: 'total_amount',
        value: data?.total_amount,
      });
      metadata.push({
        name: 'currency',
        value: data?.currency,
      });
      metadata.push({
        name: 'discount_amount',
        value: data?.discount_amount,
      });
      metadata.push({
        name: 'discount_coupon',
        value: data?.discount_coupon,
      });
      metadata.push({
        name: 'cart_list',
        value: JSON.stringify(data?.products),
      });
    }

    if (data.screenType === view && 'ContentType' in data) {
      metadata.push({
        name: 'page_name',
        value: data?.ContentType,
      });
    }

    if (
      data.screenType == view &&
      'content_type' in data &&
      data.content_type !== 'ecom'
    ) {
      const tagParsedData = JSON.parse(data?.contentData?.tags);
      const cleanedData = tagParsedData?.map((item: any) =>
        item.replace(/"/g, ''),
      );
      const tagString = cleanedData.join(' | ');
      const pageUrl =
        data?.contentData?.CurrentPageURL &&
        `https://${site_name}/en/${data.content_type.toLowerCase()}${
          data?.contentData?.CurrentPageURL
        }`;
      const pageTitle =
        data.content_type === 'Video'
          ? data?.contendData?.Title.length > 0
            ? data?.contentdata?.Title
            : data?.contentData?.Thumbnail?.Title
          : data.contentData?.Title;
      metadata.push(
        {
          name: 'author',
          value: data?.contentData?.Author,
        },
        {
          name: 'page_name',
          value: pageTitle,
        },
        {
          name: 'page_url',
          value: pageUrl,
        },
        {
          name: 'tags',
          value: tagString,
        },
      );
    }

    // Add other metadata items unconditionally
    const payload = {
      EventName:
        data.screenType == view
          ? 'page_view'
          : data.screenType == productView
          ? 'product_view'
          : data.screenType == addTocart
          ? 'add_to_cart'
          : data.screenType == cartCheckOut
          ? 'cart_checkout'
          : data.screenType == makePayment
          ? 'make_payment'
          : data.screenType == videoView
          ? getEventAction(data.videoAction)
          : 'button_click',
      visitorId: userID,
      deviceId: DeviceInfo?.getDeviceId(),
      pagePublishedId: 0,
      requestURL: 'https://rpi-server-1.hcl-x.com/',
      clientId: RPI_CLIENT_ID,
      Metadata: metadata,
    };
    const response = await makeApiCall<CreateVisitorData>({
      baseURL: restApiEndpoint + '/Events',
      sendAPIToken: false,
      method: 'post',
      data: payload,
      headers: rpiHeaders,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    const eventSchemaList = schemaData?.eventSchemaList || [];
    if(eventSchemaList.length> 0){
      console.log("Successfully received eventSchemaData")
    }
    const matchedSchema = eventSchemaList.find((item: any) => item.event_type === payload.EventName);

    if (matchedSchema) {
      const requiredFields = matchedSchema.event_schema.fields;
      const body: Record<string, any> = {};

      requiredFields.forEach((field: any) => {
        const metaItem = metadata.find((m: { name: string; value: any }) => m.name === field.name);
        if (metaItem) {
          body[field.name] = metaItem.value;
        }
      });

      const input = {
          type: payload.EventName,
          customerData: {
            email: `${user_email}`
          },
          eventDate: new Date().toISOString(),
          body: body
      };
      await triggerCustomEvents(input);
    }
    return response.data as CreateVisitorData;
  } catch (error: any) {
    throw {message: `RPI Request Failed: ${error.message}`} as ErrorResponse;
  }
}

function getEventAction(videoAction: string) {
  switch (videoAction) {
    case 'Video start':
      return 'video_start';
    case 'Video play':
      return 'video_play';
    case 'Video pause':
      return 'video_pause';
    case 'Video stop':
      return 'video_stop';
    case 'Video complete':
      return 'video_complete';
    case 'Video stream 25':
      return 'video_play_25';
    case 'Video stream 50':
      return 'video_play_50';
    case 'Video stream 75':
      return 'video_play_75';
    default:
      return 'unknown_event';
  }
}
