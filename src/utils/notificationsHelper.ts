import { recommandItemList } from "@app/constants/constants";
import Notifications from "../model/Notifications";
import StorageService from "@app/utils/storageService";

// Function to build query string from params
export const buildQueryString = (params: { [key: string]: string | string[] }): string => {
  const queryParts: string[] = [];

  Object.keys(params).forEach(key => {
    const value = params[key];

    // If the value is an array, append each value separately
    if (Array.isArray(value)) {
      value.forEach(val => {
        queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
      });
    } else {
      queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  });

  return queryParts.join('&');
};

// Function to schedule a live event notification
export const scheduleLiveEventNotification = (data: any) => {
  let contentType = data.ContentType;
  const baseUrl = `platformx://${contentType.toLowerCase()}`;
  const queryParams = {
    userid: data?.Id,
  };

  const queryString = buildQueryString(queryParams);
  let eventTitle = 'Your live event starts in 5 minutes!';
  // Schedule the notification
  Notifications.scheduleNotification(
    data?.title,
    eventTitle,
      new Date(Date.now() + 30 * 1000),
      {
      deepLinkUrl: `${baseUrl}?${queryString}`,
    }
  );

};

// Function to schedule a recommendation notification
export const scheduleRecommendationNotification = (
  data: any,
  eventTitle:string,
  eventSubtitle:string
) => {
  let contentType = data?.data?.ContentType;
  const baseUrl = `platformx://${contentType?.toLowerCase()}`;
  const queryParams = {
    userid: data?.data?.Id,
  };

  const queryString = buildQueryString(queryParams);

  // Schedule the recommendation notification
  Notifications.scheduleNotification(
    eventTitle,
    eventSubtitle,
    new Date(Date.now() + 2 * 60 * 1000), // Notification time (2 minutes for example)
    {
      deepLinkUrl: `${baseUrl}?${queryString}`,
    }
  );
};

export const scheduleReminderNotification = async (data: any, eventTitle: string, eventSubtitle: string) => {
  let contentType = data.type;
  const baseUrl = `platformx://${contentType?.toLowerCase()}`;
  const queryParams = {
    userid: data?.id,
  };
  const queryString = buildQueryString(queryParams);
  
  Notifications.scheduleNotification(
    eventTitle,
    eventSubtitle,
    new Date(Date.now() + 1 * 60 * 1000), {
    deepLinkUrl: `${baseUrl}?${queryString}`,
  }
  );
};

export const isToday = (eventStartDate?: any) => {
  const eventDate = new Date(eventStartDate);
  const today = new Date();
  return eventDate.getFullYear() === today.getFullYear() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getDate() === today.getDate();
};

export const storeRecommendationList = async (data: any) => {
  try {

    const existingData = await StorageService.getData(recommandItemList);
    let recommandItemListItem = existingData ? JSON.parse(existingData) : [];
    if (recommandItemListItem.Id === data.Id) {
      data.isWatched = true;
      await StorageService.storeData(recommandItemList, JSON.stringify({ data }));
    } else {
      data.isWatched = false;
      await StorageService.storeData(recommandItemList, JSON.stringify({ data }));
    }
  } catch (error) {
    console.error("Error storing data:", error);
  }
};