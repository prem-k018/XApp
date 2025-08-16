export type OLToken = {
  token: string;
  refresh_token: string;
};

export type AddOLPoints = {
  transferId: string;
};

export type Address = {
  // Assuming there might be properties here based on actual data
};

export type Company = {
  // Assuming there might be properties here based on actual data
};

export type DefaultAccount = {
  accountId: string;
  activePoints: number;
  transferredPoints: number;
  lockedPoints: number;
  expiredPoints: number;
  spentPoints: number;
  earnedPoints: number;
  blockedPoints: number;
};

export type CurrentLevel = {
  levelId: string;
  name: string;
  translations: {[key: string]: {name: string}};
};

export type Item = {
  manuallyAssignedLevelId?: string;
  customerId: string;
  registeredAt: string;
  active: boolean;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  address: Address;
  createdAt: string;
  updatedAt: string;
  agreement1: boolean;
  agreement2: boolean;
  agreement3: boolean;
  company: Company;
  transactionsCount: number;
  transactionsAmount: number;
  transactionsAmountWithoutDeliveryCosts: number;
  amountExcludedForLevel: number;
  averageTransactionAmount: number;
  levelAchievementDate?: string;
  labels: string[];
  anonymized: boolean;
  referralToken: string;
  defaultAccount: DefaultAccount;
  currency: string;
  storeCode: string;
  currentLevel?: CurrentLevel;
};

export type Total = {
  all: number;
  filtered: number;
  estimated: boolean;
};

export type OLMembers = {
  items: Item[];
  total: Total;
};
