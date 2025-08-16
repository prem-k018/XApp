export type BlogEntry = {
  _id: string;
  title: string;
  description: string;
  content_type: string;
  event_path: string;
  page: string;
  assets: Array<any>;
  item_path: Array<any>;
  embeded: Array<any>;
  authors: Array<any>;
  cta_title?: string;
  cta_url?: string;
  key_highlighter: Array<any>;
  is_published: boolean;
  created_date: string;
  is_soft_delete: boolean;
  created_by: string;
  last_published_date?: string;
  last_published_by: string;
  modified_date: string;
  modified_by: string;
  __v: number;
};

// Model for the response object containing the blog entries
export type BlogResponse = {
  totalCount: number;
  result: BlogEntry[];
};

// Model for the publish_fetchblog object
export type PublishFetchBlog = {
  success: boolean;
  totalCount: number;
  response: BlogResponse;
};

// Model for the root data object
export type EventBlogs = {
  data: {
    publish_fetchblog: PublishFetchBlog;
  };
};