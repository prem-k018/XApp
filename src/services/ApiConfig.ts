export enum Environment {
  Dev = 'dev',
  Qa = 'qa',
  Staging = 'stg',
  Production = 'prod',
  Kiwi = 'kiwi'
}

export const TIMEOUT = 60000;
export const RPI_PUBLISH_ID = '23f56cd2-4673-4841-810f-e92535e623e7';
export const RPI_CLIENT_ID = 'aa07a6db-0e70-4aca-93cc-45056347ed04';
export const RPI_AUTH_KEY = '2697e37d-282f-412a-8ffe-eabd5dd01a2e';
export const RPI_VIEW_NAME = 'ViewA';

export class APIConfig {
  static environment: Environment = Environment.Production;

  // Define different API endpoints for each environment
  private static endpoints = {
    [Environment.Dev]: {
      GRAPHQL_ENDPOINT:
        'https://dev.api-publish.hcl-x.com/platform-x-publish/v1/publish/gateway',
      RESTAPI_USERS_ENDPOINT: 'https://dev.users.hcl-x.com/platform-x/',
      RESTAPI_LOGIN_ENDPOINT:
        'https://dev.api-publish.hcl-x.com/platform-x-publish/auth/login',
      GRAPHQL_DELIVERY_ENDPOINT:
        'https://dev.delivery.hcl-x.com/platform-x/delivery-engine',
      RESTAPI_BLOGS_ENDPOINT:
        'https://dev.blogging.hcl-x.com/platform-x/blogging/fetch',
      RESTAPI_RPI_ENDPOINT:
        'https://rpi-server-1.hcl-x.com/interactionrealtimeapi/api',
      RESTAPI_LOYALTY_ENDPOINT:
        'https://loyalty.portal.hcl-x.com/v1/campaign/getCampaignPoints',
      RESTAPI_OPENLOYALTY_ENDPOINT:
        'https://hcltech.eu-west-1.openloyalty-stage.io/api',
    },
    [Environment.Qa]: {
      GRAPHQL_ENDPOINT:
        'https://qa.api-publish.hcl-x.com/platform-x-publish/v1/publish/gateway',
      RESTAPI_USERS_ENDPOINT: 'https://qa.users.hcl-x.com/platform-x/',
      RESTAPI_LOGIN_ENDPOINT:
        'https://qa.api-publish.hcl-x.com/platform-x-publish/auth/login',
      GRAPHQL_DELIVERY_ENDPOINT:
        'https://qa.delivery.hcl-x.com/platform-x/delivery-engine',
      RESTAPI_BLOGS_ENDPOINT:
        'https://qa.blogging.hcl-x.com/platform-x/blogging/fetch',
      RESTAPI_RPI_ENDPOINT:
        'https://rpi-server-1.hcl-x.com/interactionrealtimeapi/api',
      RESTAPI_LOYALTY_ENDPOINT:
        'https://loyalty.portal.hcl-x.com/v1/campaign/getCampaignPoints',
      RESTAPI_OPENLOYALTY_ENDPOINT:
        'https://hcltech.eu-west-1.openloyalty-stage.io/api',
    },
    [Environment.Staging]: {
      GRAPHQL_ENDPOINT:
        'https://stg.api-publish.hcl-x.com/platform-x-publish/v1/publish/gateway',
      RESTAPI_USERS_ENDPOINT: 'https://stg.users.hcl-x.com/platform-x/',
      RESTAPI_LOGIN_ENDPOINT:
        'https://stg.api-publish.hcl-x.com/platform-x-publish/auth/login',
      GRAPHQL_DELIVERY_ENDPOINT:
        'https://stg.delivery.hcl-x.com/platform-x/delivery-engine',
      RESTAPI_BLOGS_ENDPOINT:
        'https://stg.blogging.hcl-x.com/platform-x/blogging/fetch',
      RESTAPI_RPI_ENDPOINT:
        'https://rpi-server-1.hcl-x.com/interactionrealtimeapi/api',
      RESTAPI_LOYALTY_ENDPOINT:
        'https://loyalty.portal.hcl-x.com/v1/campaign/getCampaignPoints',
      RESTAPI_OPENLOYALTY_ENDPOINT:
        'https://hcltech.eu-west-1.openloyalty-stage.io/api',
    },
    [Environment.Production]: {
      GRAPHQL_ENDPOINT:
        'https://api-publish.hcltech-x.com/platform-x-publish/v1/publish/gateway',
      RESTAPI_USERS_ENDPOINT: 'https://users.hcltech-x.com/platform-x/',
      RESTAPI_LOGIN_ENDPOINT:
        'https://api-publish.hcltech-x.com/platform-x-publish/auth/login',
      GRAPHQL_DELIVERY_ENDPOINT:
        'https://delivery.hcltech-x.com/platform-x/delivery-engine',
      RESTAPI_BLOGS_ENDPOINT:
        'https://blogging.hcltech-x.com/platform-x/blogging/fetch',
      RESTAPI_RPI_ENDPOINT:
        'https://rpi-server-1.hcl-x.com/interactionrealtimeapi/api',
      RESTAPI_LOYALTY_ENDPOINT:
        'https://loyalty.portal.hcl-x.com/v1/campaign/getCampaignPoints',
      RESTAPI_OPENLOYALTY_ENDPOINT:
        'https://hcltech.eu-west-1.openloyalty-stage.io/api',
    },
    [Environment.Kiwi]: {
      GRAPHQL_ENDPOINT:
        'https://kiwi.api-publish.hcl-x.com/platform-x-publish/v1/publish/gateway',
      RESTAPI_USERS_ENDPOINT: 'https://dev.users.hcl-x.com/platform-x/',
      RESTAPI_LOGIN_ENDPOINT:
        'https://dev.api-publish.hcl-x.com/platform-x-publish/auth/login',
      GRAPHQL_DELIVERY_ENDPOINT:
        'https://dev.delivery.hcl-x.com/platform-x/delivery-engine',
      RESTAPI_BLOGS_ENDPOINT:
        'https://dev.blogging.hcl-x.com/platform-x/blogging/fetch',
      RESTAPI_RPI_ENDPOINT:
        'https://rpi-server-1.hcl-x.com/interactionrealtimeapi/api',
      RESTAPI_LOYALTY_ENDPOINT:
        'https://loyalty.portal.hcl-x.com/v1/campaign/getCampaignPoints',
      RESTAPI_OPENLOYALTY_ENDPOINT:
        'https://hcltech.eu-west-1.openloyalty-stage.io/api',
    },
  };

  private static imageBaseURL = {
    [Environment.Dev]: {
      IMAGE_BASEURL: 'https://storage.googleapis.com/cropped_image_public/',
    },
    [Environment.Qa]: {
      IMAGE_BASEURL:
        'https://storage.googleapis.com/cropped_image_public_x_site_qa/',
    },
    [Environment.Staging]: {
      IMAGE_BASEURL:
        'https://storage.googleapis.com/cropped_image_public_x_site_stage/',
    },
    [Environment.Production]: {
      IMAGE_BASEURL:
        'https://storage.googleapis.com/cropped_image_public_x_site_live/',
    },
    [Environment.Kiwi]: {
      IMAGE_BASEURL: 'https://storage.googleapis.com/cropped_image_public/',
    },
  };

  private static olCtCategory = {
    [Environment.Dev]: {
      OL_CT_CATEGORY: '676d35f3-692c-4108-b812-22ec092479af',
    },
    [Environment.Qa]: {
      OL_CT_CATEGORY: '676d35f3-692c-4108-b812-22ec092479af',
    },
    [Environment.Staging]: {
      OL_CT_CATEGORY: '676d35f3-692c-4108-b812-22ec092479af',
    },
    [Environment.Kiwi]: {
      OL_CT_CATEGORY: '0ac7e7ee-1690-4648-bf3b-b36526c54458',
    },
    [Environment.Production]: {
      OL_CT_CATEGORY: '91490383-24e1-45e3-ad8d-ab7520a66114',
    }
  }

  private static spinWheelCategoryId = {
    [Environment.Dev]: {
      SPIN_WHEEL_CATEGORY: '58d25ead-d549-495a-b6ac-97a92f44a2ff',
    },
    [Environment.Qa]: {
      SPIN_WHEEL_CATEGORY: '58d25ead-d549-495a-b6ac-97a92f44a2ff',
    },
    [Environment.Staging]: {
      SPIN_WHEEL_CATEGORY: '58d25ead-d549-495a-b6ac-97a92f44a2ff',
    },
    [Environment.Kiwi]: {
      SPIN_WHEEL_CATEGORY: 'd8b960aa-df26-4bd9-b5ec-a6baef9bb03d',
    },
    [Environment.Production]: {
      SPIN_WHEEL_CATEGORY: 'ecdd9bb9-680f-4088-9987-89a006ecf88a',
    }
  }

  // Define headers for different APIs

  //QA == platformx.qa.hcl-x.com
  //Dev == du.hcl-x.com
  //Retail == retail.stg-hcltech-x.com
  //Feyenoord == feyenoord.stg-hcltech-x.com

  private static headers = {
    GRAPHQL_HEADERS: {
      'Content-Type': 'application/json',
      site_host: 'du.hcl-x.com',
    },
    RESTAPI_HEADERS: {
      'Content-Type': 'application/json',
      site_host: 'du.hcl-x.com',
    },
    RPI_HEADERS: {
      'Content-Type': 'application/json',
      RPIAuthKey: '2697e37d-282f-412a-8ffe-eabd5dd01a2e',
    },
  };

  // Set the current Site Host
  static setSiteHost(host: string) {
    this.headers.GRAPHQL_HEADERS.site_host = host;
    this.headers.RESTAPI_HEADERS.site_host = host;
  }

  // Set the current environment
  static setEnvironment(environment: Environment) {
    this.environment = environment;
  }

  // Get the API endpoint for the current environment
  static getGraphQLEndpoint() {
    return this.endpoints[this.environment].GRAPHQL_ENDPOINT;
  }

  static getGraphQLDeliveryEndpoint() {
    return this.endpoints[this.environment].GRAPHQL_DELIVERY_ENDPOINT;
  }

  static getRestApiUsersEndpoint() {
    return this.endpoints[this.environment].RESTAPI_USERS_ENDPOINT;
  }

  static getRestApiLoginEndpoint() {
    return this.endpoints[this.environment].RESTAPI_LOGIN_ENDPOINT;
  }

  static getRestApiBlogsEndpoint() {
    return this.endpoints[this.environment].RESTAPI_BLOGS_ENDPOINT;
  }

  static getRestApiRPIEndpoint() {
    return this.endpoints[this.environment].RESTAPI_RPI_ENDPOINT;
  }

  static getRestApiLoyaltyEndpoint() {
    return this.endpoints[this.environment].RESTAPI_LOYALTY_ENDPOINT;
  }

  static getRestApiOpenLoyaltyEndpoint() {
    return this.endpoints[this.environment].RESTAPI_OPENLOYALTY_ENDPOINT;
  }

  // Get the headers for the current environment
  static getGraphQLHeaders() {
    return this.headers.GRAPHQL_HEADERS;
  }

  static getRestApiHeaders() {
    return this.headers.RESTAPI_HEADERS;
  }

  static getRPIApiHeaders() {
    return this.headers.RPI_HEADERS;
  }

  static getImageBaseURL() {
    return this.imageBaseURL[this.environment].IMAGE_BASEURL;
  }

  static contentShareBaseURL() {
    return `https://${this.headers.RESTAPI_HEADERS.site_host}/en/`;
  }

  static getOLCtCategoryId() {
    return this.olCtCategory[this.environment].OL_CT_CATEGORY
  }

  static getSpinWheelCategoryId() {
    return this.spinWheelCategoryId[this.environment].SPIN_WHEEL_CATEGORY
  }
}
