export type MyStory = {
    Title: string;
    Description: string;
    PublishedDate: string;
    lastModifiedDate: string;
    ContentType: string;
    tags: string[];
    Author: string;
    CurrentPageURL: string;
    EditorialItemPath: string;
    Id: string;
    SchemaDocumentType?: string;
    Banner?: string;
    Thumbnail: Thumbnail;
    PublishedBy?: string;
    hclplatformx_EditorialTags?: string;
    background_content?: BackgroundContent;
    EventEndDate?: string;
    EventStartDate?: string;
    GoogleApiAddress?: string;
}

export type Thumbnail = {
    Name: string;
    Title: string;
    Description: string;
    Url: string;
    Attribution: boolean;
    ext?: string;
    visibility?: string;
    AltText?: string;
}

export type BackgroundContent = {
    objectType: string;
    ext?: string;
    Url: string;
    Title?: string;
    Thumbnail?: string;
    Color?: string;
}

export type MyStoriesReponse = {
    data: {
        publish_fetchEcomProducts: MyStory[];
    }
}
