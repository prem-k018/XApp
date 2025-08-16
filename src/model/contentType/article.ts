export type ContentDetailResponse = {
  data: {
    publish_contentDetail: ArticleDetail;
  };
}

export type ArticleDetail = {
  page: string;
  title: string;
  banner: string;
  description: string;
  tag_name: string;
  category: string;
  sub_title: string;
  current_page_url: string;
  parent_page_url: string;
  developed_by: string;
  developed_date: string;
  page_createdby: string;
  page_state: string;
  page_lastmodifiedby: string;
  page_publishedby: string;
  is_softdelete: boolean;
  is_edit: boolean;
  seo_enable: boolean;
  analytics_enable: boolean;
  robot_txt: boolean;
  sitemap: boolean;
  structure_data: string;
  settings: Settings;
  user_action_info: string;
  content_type: string;
  article_content: ArticleContent;
  links: any[];
  link_tags: any[];
  creation_date: string;
  last_modification_date: string;
  tags: string[];
  published_images: PublishedImage[];
  original_image: OriginalImage;
  is_featured: boolean;
  latest_articles: LatestArticle[];
}

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
}

export type ArticleContent = {
  images: { [key: string]: any };
  videos: { [key: string]: any };
}

export type PublishedImage = {
  aspect_ratio: string;
  folder_path: string;
}

export type OriginalImage = {
  original_image_relative_path: string;
  bitStreamId: string;
  auto: boolean;
  ext: string;
  visibility: string;
  Thumbnail: string;
}

export type LatestArticle = {
  title: string;
  banner: string;
  thumbnail: string;
  description: string;
  published_date: string;
  content_type: string;
  author: string;
  current_page_url: string;
  page_lastmodifiedby: string;
  original_image: OriginalImage;
  published_images: PublishedImage[];
  is_featured: boolean;
}
