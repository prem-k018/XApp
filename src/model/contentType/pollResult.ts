export type PollOption = {
  option_id: string;
  option_text: string;
  count: number;
  percentage: string;
  _id: string;
};

export type PollResultData = {
  title: string;
  document_path: string;
  options: PollOption[];
  status: boolean;
  total_vote: number;
  start_date: string | null;
  end_date: string | null;
  created_by: string;
  updated_by: string | null;
  createdAt: string;
  updatedAt: string;
  __typename: string;
};

export type PollSaveData = {
  message: string;
  __typename: string;
}

export type PollResultResponse = {
  data: {
    users_fetchContent: PollResultData;
  }
};

export type PollSaveResponse = {
  data: {
    users_saveContent: PollSaveData;
  }
};
