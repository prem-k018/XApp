export type LoginResponse = {
  code: number;
  status: string;
  data: UserData;
};

export type UserData = {
  user_id: string;
  name: string;
  first_name: string;
  last_name: string;
  email_id: string;
  username: string;
  email_verified: boolean;
  gender: string;
  roles: any;
  permissions: any;
  tokens: string;
};
