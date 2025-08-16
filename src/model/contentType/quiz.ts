export type UserActionDetails = {
  publishByDetails: {
    name: string;
    email: string;
    timeZone: string;
    pubUnpubDateTime: string;
  };
  unpublishByDetails: {
    name: string;
    email: string;
    timeZone: string;
    pubUnpubDateTime: string;
  };
};

export type Option = {
  option_image: {
    url: string;
    title: string;
  };
  is_correct: boolean;
  option_text: string;
  option_id: string;
};

export type BackgroundContent = {
  Url: string;
  IsImage: boolean;
  Title: string;
  Description: string;
  ColorCode: string;
};

export type BackgroundContentMain = {
  objectType: string;
  Url?: string;
  Title: string;
  Thumbnail?: string;
  Color?: string;
  ext?: string;
};

export type OriginalImage = {
  original_image_relative_path: string;
  bitStreamId: string;
  auto: boolean;
  ext: string;
  visibility: string;
  Thumbnail?: string;
  Title?: string;
  Description?: string;
};

export type PublishedImage = {
  aspect_ratio: string;
  folder_path: string;
};

export type Question = {
  analytics_enable: boolean;
  background_content?: BackgroundContent;
  category: string;
  content_type: string;
  creationDate: string;
  current_page_url: string;
  is_edit: boolean;
  is_image_option: boolean;
  is_softdelete: boolean;
  modificationDate: string;
  options_compound_fields: Option[];
  page: string;
  page_createdby: string;
  page_lastmodifiedby: string;
  question: string;
  question_type: string;
  robot_txt: boolean;
  seo_enable: boolean;
  site_name: string;
  sitemap: boolean;
  tag_name: string;
  tagging: string;
  user_action_info: UserActionDetails;
  original_image: OriginalImage | {};
  published_images: PublishedImage[] | {};
};

export type Settings = {
  keywords: string[];
  page_caching: boolean;
  page_mobile_friendly: boolean;
  is_schedule_publish: boolean;
  is_schedule_unpublish: boolean;
  seo_title: string;
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

export type QuizDetail = {
  content_type: string;
  seo_enable: boolean;
  user_action_info: UserActionDetails;
  title: string;
  tagging: string;
  tag_name: string;
  structure_data: string;
  sitemap: boolean;
  robot_txt: boolean;
  result_range_4: string;
  result_range_3: string;
  result_range_2: string;
  result_range_1: string;
  questions: Question[];
  parent_page_url: string;
  page_state: string;
  page_publishedby: string;
  page_lastmodifiedby: string;
  page_createdby: string;
  page: string;
  is_softdelete: boolean;
  is_edit: boolean;
  display_scores: string;
  description: string;
  current_page_url: string;
  created_date: string;
  background_content?: BackgroundContentMain;
  analytics_enable: boolean;
  last_modified_by: string;
  last_modified_date: string;
  settings: Settings;
  published_date: string;
  original_image: OriginalImage | {};
  published_images: PublishedImage[] | [];
  is_featured: boolean;
  tags: { [key: string]: any };
};

export type ContentDetailResponse = {
  data: {
    publish_contentDetail: QuizDetail;
  };
};
