export type PublishFetchSchemaContent = {
  id: string;
  documentpath: string;
  language: string;
  _pathx_can: string;
  path: string;
  multisite_name: string;
  name: string;
  facet_tags: string[];
  tag_name: string;
  banner: Banner;
  analytics: string;
  last_modification_date: string;
  seo: string;
  select: SelectItem[];
  creation_date: string;
  date_time: string;
  locale: string;
  parent_page_url: string;
  _tag_name: string;
  current_page_url: string;
  impression: string;
  tags: string[];
  document_state: string;
  title: string;
  jcr_is_checked_out: boolean;
  is_soft_delete: boolean;
  last_modified_by: string;
  page: string;
  description: string;
  _version_: number;
  published_date: string;
  latest_content: LatestContent[];
};

export type Banner = {
  original_image: OriginalImage;
  published_images: PublishedImage[];
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

export type SelectItem = {
  label: string;
  id: string;
  parentId: number;
};

export type LatestContent = {
  title: string;
  banner: BannerContent;
  thumbnail: Thumbnail;
  description: string;
  published_date: string;
  content_type: string;
  current_page_url: string;
  original_image: OriginalImage | null;
  published_images: PublishedImage[] | null;
  content_image: ContentImage;
};

export type BannerContent = {
  type: string;
  items: {
    "hclplatformx:published_images": PublishedImage[];
    "hclplatformx:original_image": OriginalImage;
  };
};

export type Thumbnail = {
  url: string;
  ext: string;
  visibility: string;
  thumbnail: string;
};

export type ContentImage = {
  published_images: PublishedImage[];
  original_image: OriginalImage;
};

export type SchemaContentData = {
  data: {
    publish_fetchSchemaContent: PublishFetchSchemaContent;
  };
};
