import CardTypes from '@app/components/cards/cardTypes';
import {Content} from '@app/model/content';
import {MyStory} from '@app/model/myStories';
import {PollContentDetails} from '@app/model/contentType/poll';
import {APIConfig} from '@app/services/ApiConfig';

export enum ObjectType {
  Image = 'image',
  Color = 'color',
  // Add more values if needed
}

export function shareURL(contentType: String, pageURL: String): string {
  const baseURL = APIConfig.contentShareBaseURL();
  return `${baseURL}${contentType.toLowerCase()}${pageURL}`;
}

export function loadImageForHomePage(content?: Content | MyStory): {
  value: string;
  isColor: boolean;
} {
  const baseURL = APIConfig.getImageBaseURL();

  if (content?.ContentType === CardTypes.Video) {
    if (!content.Banner?.includes('https://')) {
      let newUrl = baseURL + content?.Banner;
      return {value: newUrl, isColor: false};
    } else {
      return {value: content?.Banner ?? '', isColor: false};
    }
  } else if (content?.ContentType === CardTypes.Article) {
    const contentObj = content?.Thumbnail ?? content?.background_content;

    if (!contentObj.Url?.includes('https://')) {
      let newUrl = baseURL + contentObj?.Url + '.' + contentObj?.ext;
      return {value: newUrl, isColor: false};
    } else {
      return {value: contentObj?.Url ?? '', isColor: false};
    }
  } else if (content?.ContentType === 'wheel') {
    const contentObj = content?.Thumbnail ?? content?.background_content;

    if (!contentObj.Url?.includes('https://')) {
      let newUrl = baseURL + contentObj?.Url + '.' + contentObj?.ext;
      return {value: newUrl, isColor: false};
    } else {
      return {value: contentObj?.Url ?? '', isColor: false};
    }
  } else {
    const contentObj = content?.background_content ?? content?.Thumbnail;
    return getImageOrColorValue(baseURL, contentObj);
  }
}

export function loadImageForPollDetail(
  content?: PollContentDetails,
  pollSubmitStatus?: boolean,
): {
  value: string;
  isColor: boolean;
} {
  const contentObj = pollSubmitStatus
    ? content?.background_content
    : content?.question_background_content;
  const skipExt = !pollSubmitStatus;

  const baseURL = APIConfig.getImageBaseURL();
  return getImageOrColorValue(baseURL, contentObj, skipExt);
}

export function loadImageForQuizDetailHome(content?: any): {
  value: string;
  isColor: boolean;
} {
  const baseURL = APIConfig.getImageBaseURL();
  return getImageOrColorValue(baseURL, content);
}

export function loadImageForQuizQuestions(content?: any): {
  value: string;
  isColor: boolean;
} {
  const baseURL = APIConfig.getImageBaseURL();
  return getImageOrColorValueForQuizQuestion(baseURL, content);
}

export function loadImage(dataPath: string, extenstion?: string) {
  const baseURL = APIConfig.getImageBaseURL();
  const fullURL = `${baseURL}${dataPath}.${extenstion}`;
  return fullURL;
}

const getImageOrColorValue = (
  baseURL: any,
  content?: any,
  skipExt?: boolean,
) => {
  const defaultImage =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIoAAACKCAMAAABCWSJWAAAAUVBMVEXd3d3g4ODNzc3j4+M7Ozupqal7e3vR0dGLi4tdXV3o6Ohvb2/W1tZsbGycnJxKSkqSkpIAAACxsbF1dXU2NjbHx8dRUVEgICARERG+vr64uLiybrQAAAAAzUlEQVR4nO3WSRKCMBBA0Qw2kTYDGnG6/0GNLpAbtIv/FlSxyq8UaeIcAAAAAAAAAAAAAAAw5TfWIamcvnp5ReOUcF3qcGxLFdsWHw45DqG5OmfrlOS882tLms7J8nv5pGivcW05+tQvhi3flHnRtVURuYl1yiQx9FLKqVmnbMv72Trl90LKPiV//EWKyvn+mNTbp4zDPPblMqdonhLlOeZtkGy+K1lVx19oPNU45Xr8sR1xuU87L9P7U9yzvskBAAAAAAAAAAAAAAD8tzdQYAdOgzoIUQAAAABJRU5ErkJggg==';

  if (content?.objectType === ObjectType.Image) {
    if (!content.Url?.includes('https://')) {
      const newUrl = skipExt
        ? baseURL + content.Url
        : baseURL + content.Url + '.' + content.ext;
      return {value: newUrl, isColor: false};
    } else {
      return {value: content?.Url ?? '', isColor: false};
    }
  } else if (content?.objectType === ObjectType.Color) {
    return {value: content?.Color ?? '', isColor: true};
  } else {
    // Handle the case when the objectType is neither 'image' nor 'color'
    return {value: defaultImage, isColor: false};
  }
};

const getImageOrColorValueForQuizQuestion = (baseURL: any, content?: any) => {
  if (content?.IsImage === true) {
    if (!content.Url?.includes('https://')) {
      let newUrl = baseURL + content?.Url;
      return {value: newUrl, isColor: false};
    } else {
      return {value: content?.Url ?? '', isColor: false};
    }
  } else if (content?.IsImage === false) {
    return {value: content?.ColorCode ?? '', isColor: true};
  } else {
    // Handle the case when the objectType is neither 'image' nor 'color'
    return {value: '', isColor: false};
  }
};

export const loadImageForSelectedEnv = (Thumbnail: any) => {
  if (
    Thumbnail.original_image_relative_path &&
    !Thumbnail.original_image_relative_path.includes('https://')
  ) {
    const imageBaseURL = APIConfig.getImageBaseURL();
    let newUrl =
      imageBaseURL +
      Thumbnail.original_image_relative_path +
      '.' +
      Thumbnail.ext;
    console.log('New Converted Image URL', newUrl);
    return newUrl;
  }
  return Thumbnail.Url;
};

export const loadImageByAddingBaseUrl = (url: string) => {
  const baseURL = APIConfig.getImageBaseURL();
  const fullURL = `${baseURL}${url}`;
  return fullURL;
};
