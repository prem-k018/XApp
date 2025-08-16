export type ContentDetailResponse = {
  data: {
    publish_contentDetail: EventDetail;
  };
};

export type EventDetail = {
  user_action_info: UserActionInfo;
  PageTags: string[];
  actual_address: string;
  event_end_date: string;
  event_start_date: string;
  google_api_address: string;
  title: string;
  tagging: string;
  tag_name: string;
  structure_data: string;
  sitemap: boolean;
  robot_txt: boolean;
  published_date: string;
  parent_page_url: string;
  page_state: string;
  page_publishedby: string;
  page_lastmodifiedby: string;
  page_createdby: string;
  page: string;
  is_softdelete: boolean;
  is_edit: boolean;
  virtual_address: string;
  description: string;
  current_page_url: string;
  document_path: string;
  createdBy: string;
  seo_enable: boolean;
  analytics_enable: boolean;
  settings: Settings;
  content_type: string;
  creationDate: string;
  keywords: string[];
  modificationDate: string;
  last_modification_date: string;
  last_modified_by: string;
  postal_code: string;
  blog_settings: string;
  original_image: OriginalImage;
  published_images: PublishedImage[];
  is_featured: boolean;
};

export type UserActionInfo = {
  publishByDetails: PublishByDetails;
  unpublishByDetails: UnpublishByDetails;
};

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
