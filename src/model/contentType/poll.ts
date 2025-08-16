export type PublishByDetails = {
  name: string;
  email: string;
  timeZone: string;
  pubUnpubDateTime: string;
};

export type UnpublishByDetails = {
  email: string;
  name: string;
  timeZone: string;
  pubUnpubDateTime: string;
};

export type UserActionInfo = {
  publishByDetails: PublishByDetails;
  unpublishByDetails: UnpublishByDetails;
};

export type OriginalImage = {
  original_image_relative_path: string;
  bitStreamId: string;
  auto: boolean;
  ext: string;
  visibility: string;
  Thumbnail: string;
  Title: string;
  Description: string;
};

export type PublishedImage = {
  aspect_ratio: string;
  folder_path: string;
};

export type QuestionBackgroundContent = {
  objectType: string;
  Url: string;
  Title: string;
  Thumbnail: string;
  Color: string;
  original_image: OriginalImage;
  published_images: PublishedImage[];
};

export type BackgroundContent = {
  objectType: string;
  Url: string;
  Title: string;
  Thumbnail: string;
  Color: string;
  ext: string;
};

export type Settings = {
  keywords: string[];
  page_caching: boolean;
  page_mobile_friendly: boolean;
  is_schedule_publish: boolean;
  is_schedule_unpublish: boolean;
  seo_description: string;
  seo_keywords: string[];
  seo_blockIndexing: boolean;
  socialog_title: string;
  socialog_description: string;
  socialog_sitename: string;
  socialog_type: string;
  socialog_url: string;
  socialog_image: string;
  socialog_twitter_title: string;
  socialog_twitter_description: string;
  socialog_twitter_image: string;
  socialog_twitter_url: string;
};

export type OptionImage = {
  url: string;
  title: string;
};

export type OptionCompoundFields = {
  option_image: OptionImage;
  option_text: string;
  option_id: string;
};

export type OriginalImageDetails = {
  original_image_relative_path: string;
  bitStreamId: string;
  auto: boolean;
  ext: string;
  visibility: string;
  Thumbnail: string;
  Title: string;
  Description: string;
};

export type PollContentDetails = {
  seo_enable: boolean;
  question_background_content: QuestionBackgroundContent;
  is_image_option: boolean;
  user_action_info: UserActionInfo;
  title: string;
  tagging: string;
  tag_name: string;
  structure_data: string;
  sitemap: boolean;
  robot_txt: boolean;
  parent_page_url: string;
  page_state: string;
  page_publishedby: string;
  page_lastmodifiedby: string;
  page_createdby: string;
  page: string;
  is_softdelete: boolean;
  is_edit: boolean;
  description: string;
  current_page_url: string;
  document_path: string;
  createdBy: string;
  background_content: BackgroundContent;
  analytics_enable: boolean;
  poll_description: string;
  poll_title: string;
  settings: Settings;
  display_scores: string;
  poll_question: string;
  options_compound_fields: OptionCompoundFields[];
  content_type: string;
  creationDate: string;
  modificationDate: string;
  last_modification_date: string;
  last_modified_by: string;
  keywords: string;
  published_images: PublishedImage[];
  original_image: OriginalImageDetails;
  is_featured: boolean;
};

export type PollResponse = {
  data: {
    publish_contentDetail: PollContentDetails;
  };
};
