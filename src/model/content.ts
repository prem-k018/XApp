export type Thumbnail = {
  Name: string;
  Url: string;
  Title: string;
  Description: string;
  Attribution: boolean;
  AltText: string;
  ext: string;
  visibility: string;
};

export type Content = {
  position?: string;
  tshirt_number?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  hideContentTag?: boolean;
  Title: string;
  Banner?: string;
  Thumbnail: Thumbnail;
  Description: string;
  PublishedDate: string;
  lastModifiedDate: string;
  ContentType: string;
  tags: string[];
  Author: string;
  CurrentPageURL: string;
  hclplatformx_EditorialTags: string;
  EditorialItemPath: string;
  PublishedBy: string;
  Id: string;
  EventStartDate?: string;
  EventEndDate?: string;
  GoogleApiAddress?: string;
  bannerImage?: string;
  background_content?: {
    objectType: string;
    Url?: string;
    Title?: string;
    Thumbnail?: string;
    Color?: string;
    ext?: string;
  };
  is_featured?: boolean | string;
};

export type Error = {
  message: string;
  code: string;
};

export type ContentsResponse = {
  data: {
    publish_getContents: {
      records: Content[];
      total_records: number;
    };
  };
  errors: Error[];
};
