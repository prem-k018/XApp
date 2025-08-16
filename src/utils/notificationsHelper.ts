import Notifications from '@app/model/Notifications';
import StorageService from '@app/utils/storageService';
import {recommandItemList} from '@app/constants/constants';

export const buildQueryString = (params: {[k: string]: any}): string =>
  Object.keys(params)
    .filter(k => params[k] !== undefined && params[k] !== null)
    .map(k => {
      const v = params[k];
      if (Array.isArray(v)) {
        return v
          .map(val => `${encodeURIComponent(k)}=${encodeURIComponent(val)}`)
          .join('&');
      }
      return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
    })
    .join('&');

type NormalizedContent = {
  id?: string | number;
  contentType?: string;
  title?: string;
  author?: string;
  deepLink?: string;
  eventStartDate?: string;
  _raw: any;
};

/**
 * Accepts multiple shapes:
 *  - raw content object with keys: Id / id, ContentType / type, Title / title, DeepLink / deepLink
 *  - wrapper { data: {...} }
 *  - stored video wrapper { id, data: {...} }
 */
function normalizeContent(input: any): NormalizedContent {
  if (!input) return {_raw: input};
  const inner = input.data ? input.data : input;
  return {
    id:
      inner.Id ??
      inner.id ??
      input.Id ??
      input.id, // wrapper may hold id
    contentType:
      inner.ContentType ??
      inner.contentType ??
      inner.type ??
      input.ContentType ??
      input.type,
    title: inner.Title ?? inner.title ?? input.Title ?? input.title,
    author: inner.Author ?? inner.author ?? input.Author ?? input.author,
    deepLink:
      inner.DeepLink ??
      inner.deepLink ??
      input.DeepLink ??
      input.deepLink,
    eventStartDate:
      inner.EventStartDate ??
      inner.eventStartDate ??
      input.EventStartDate ??
      input.eventStartDate,
    _raw: input,
  };
}

function buildDeepLink(n: NormalizedContent, extraParams?: Record<string, any>) {
  const schemeBase = (n.contentType || 'content').toLowerCase();
  const params: Record<string, any> = {
    userid: n.id,
    ...extraParams,
  };
  const query = buildQueryString(params);
  return `platformx://${schemeBase}?${query}`;
}

// Generic scheduler wrapper
function scheduleWithDelay(
  delayMs: number,
  title: string,
  body: string,
  data: Record<string, any>,
) {
  const fireDate = new Date(Date.now() + delayMs);
  Notifications.scheduleNotification(title, body, fireDate, data);
}

// ------------------ Public API ------------------

/**
 * Live event notification:
 * - Called when you detect (minutesDifference == 5 && appState != 'active')
 * - Keeps the "Your live event will start in 5 minutes!" wording
 * - Uses a short delay (30s) to mirror prior helper timing; adjust if needed.
 */
export function scheduleLiveEventNotification(content: any) {
  const n = normalizeContent(content);
  if (!n.contentType) return;

  const body = 'Your live event will start in 5 minutes!';
  const title = n.title || 'Live Event';
  const deepLinkUrl = buildDeepLink(n);
  scheduleWithDelay(30 * 1000, title, body, {
    deepLinkUrl,
    ContentType: n.contentType,
    Id: n.id,
    EventStartDate: n.eventStartDate,
  });
}

/**
 * Recommendation notification:
 * - You pass wrapper (recommandItemListItem)
 * - eventTitle -> notification title
 * - eventSubtitle -> notification body
 * - Fires after 2 minutes (as before).
 */
export function scheduleRecommendationNotification(
  contentWrapper: any,
  eventTitle: string,
  eventSubtitle: string,
) {
  const n = normalizeContent(contentWrapper);
  if (!n.contentType) return;
  const deepLinkUrl = buildDeepLink(n);
  scheduleWithDelay(2 * 60 * 1000, eventTitle, eventSubtitle, {
    deepLinkUrl,
    ContentType: n.contentType,
    Id: n.id,
  });
}

/**
 * Reminder notification (e.g., resume video)
 * - Called with stored video wrapper OR raw inner content.
 * - Delay 1 minute as in your current code.
 */
export function scheduleReminderNotification(
  videoWrapper: any,
  eventTitle: string,
  eventSubtitle: string,
) {
  const n = normalizeContent(videoWrapper);
  if (!n.contentType) return;
  const deepLinkUrl = buildDeepLink(n);
  scheduleWithDelay(1 * 60 * 1000, eventTitle, eventSubtitle, {
    deepLinkUrl,
    ContentType: n.contentType,
    Id: n.id,
  });
}

export const isToday = (date?: any) => {
  const d = new Date(date);
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
};

// Store recommendation watch status (retains your original logic)
export const storeRecommendationList = async (data: any) => {
  try {
    const existingData = await StorageService.getData(recommandItemList);
    const existingParsed = existingData ? JSON.parse(existingData) : null;

    // Mark newly stored item (simple override pattern)
    const wrapper = {
      data,
      isWatched:
        existingParsed?.data?.Id === data?.Id
          ? true
          : !!data?.isWatched || false,
    };
    await StorageService.storeData(
      recommandItemList,
      JSON.stringify(wrapper),
    );
  } catch (e) {
    console.error('Error storing recommendation data:', e);
  }
};

export async function listScheduledNotifications() {
  try {
    return Notifications.getScheduledNotifications();
  } catch {
    return [];
  }
}
