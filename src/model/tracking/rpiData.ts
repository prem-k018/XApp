export type Value = {
  Name: string;
  Value: string;
  ValueJSON: any;
  ValueCollection: any[] | null;
  IsCollection: boolean;
};

export type View = {
  VisitorID: string;
  DeviceID: string;
  ViewName: string;
  Values: Value[];
};

export type CreateVisitorData = {
  VisitorID: string;
  DeviceID: string;
  ImpressionID: string;
  IsMasterKey: boolean;
  HasAlternativeKey: boolean;
  Keys: any[] | null;
  View: View;
};

export type VisitorData = {
  VisitorID: string;
  DeviceID: string;
  ViewName: string;
  Values: Value[];
};
