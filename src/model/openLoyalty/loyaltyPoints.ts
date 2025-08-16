export type ProvideLoyaltyPoints = {
  data: {
    publish_providePoints: {
      statusCode: number;
      data: {
        message: string;
        LoyaltydPoints: number;
      };
    };
  };
};

export type LoyaltyPoints = {
  [x: string]: any;
  result: number;
};
