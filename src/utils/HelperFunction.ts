// this function takes in a string of the published date, converts into a date,
//then converts into an array and return a string
// ex. 2023-10-10T09:02:11Z returns Oct 10, 2023 | 02: 02 AM

import { APIConfig, Environment } from '@app/services/ApiConfig';
import StorageService from './storageService';
import {
  customSchemaEvent,
  defaultSiteHost,
  environment,
  loginInfo,
  loginToken,
  siteHost,
  storedUserID,
  tagListArray,
  userInfo,
} from '@app/constants/constants';
import NavigationService from '@app/navigators/navigationService';
import CardTypes from '@app/components/cards/cardTypes';
import { icons } from '@app/assets/icons';

//
export function getDateTimePosted(publishedDate: string) {
  const date = new Date(publishedDate);

  const dateArray = date.toString().split(' ');

  const hrsArray = dateArray[4]?.split(':');

  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

  const convertedTime = hrsArray[0] + ': ' + hrsArray[1] + ' ' + ampm;

  // converted date string MMM DD, YYYY | HH:MM a'
  const appendedDate =
    dateArray[1] +
    ' ' +
    dateArray[2] +
    ', ' +
    dateArray[3] +
    ' | ' +
    convertedTime;
  return appendedDate;
}

export function getTime(publishedDate: string) {
  const date = new Date(publishedDate);
  const hour = date.getHours();
  const minutes = date.getMinutes();

  const convertedTime = `${hour % 24}:${minutes.toString().padStart(2, '0')}`;
  return convertedTime;
}

export function getDatePosted(publishedDate: string) {
  const date = new Date(publishedDate);

  const dateArray = date.toString().split(' ');

  return dateArray[1] + ' ' + dateArray[2] + ', ' + dateArray[3];
}

export function getDateOfBirth(publishedDate: string) {
  const dateString = publishedDate;
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const formattedDate = date.toLocaleDateString('en-US', options);
  return formattedDate;
}

export function getDayMonth(publishedDate: string) {
  const dateString = publishedDate;
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };
  const formattedDate = date.toLocaleDateString('en-US', options);
  return formattedDate;
}

export function isEmailValid(email: string): boolean {
  // Regular expression for a basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Test the email against the regular expression
  return emailRegex.test(email);
}

export function getCurrencySymbol(currencyCode: string): string {
  // Define a mapping of currency codes to symbols
  const currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    AUD: 'A$',
    CAD: 'C$',
    INR: '₹',
    CHF: 'CHF',
    CNY: '¥',
    HKD: 'HK$',
    NZD: 'NZ$',
    SGD: 'S$',
    SEK: 'kr',
    NOK: 'kr',
    KRW: '₩',
    MXN: 'Mex$',
    BRL: 'R$',
    ZAR: 'R',
    TRY: '₺',
    RUB: '₽',
    // Add more currency code-symbol mappings as needed
  };

  // Return the corresponding symbol for the given currency code
  return currencySymbols[currencyCode] || currencyCode; // If no symbol found, return the currency code itself
}

export function stringToEnvironment(
  envString: string | null,
): Environment | undefined {
  if (
    envString !== null &&
    Object.values(Environment).includes(envString as Environment)
  ) {
    return envString as Environment;
  }
  return undefined;
}

export async function getEnvironmentValue(key: string) {
  try {
    const value = await StorageService.getData(key);
    return value;
  } catch (error) {
    return null;
  }
}

export async function clearCacheDataAndNavigateToLogin() {
  const envString: string | null = await getEnvironmentValue(environment);
  const site_host: string | null = await getEnvironmentValue(siteHost);

  const environmentName: Environment | undefined =
    stringToEnvironment(envString);

  if (environmentName !== undefined && site_host !== null) {
    await StorageService.clearData(loginToken);
    await StorageService.clearData(loginInfo);
    await StorageService.clearData(tagListArray);
    await StorageService.clearData(storedUserID);
    await StorageService.clearData(userInfo);
    await StorageService.clearData(customSchemaEvent);

    APIConfig.setSiteHost(site_host);
    APIConfig.setEnvironment(environmentName);
    NavigationService.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  }
}

export const calculateAge = (dobString: string) => {
  const dob = new Date(dobString); // Parse the DOB string into a Date object
  const today = new Date(); // Get today's date

  let DateOfBirth = today.getFullYear() - dob.getFullYear(); // Calculate the difference in years
  const monthDifference = today.getMonth() - dob.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < dob.getDate())
  ) {
    DateOfBirth--;
  }

  return DateOfBirth;
};

export function capitalizeFirstLetter(str: string) {
  if (!str) return str;
  return str?.charAt(0)?.toUpperCase() + str?.slice(1);
}

export default async function initializeEnvironment() {
  const envString: string | null = await getEnvironmentValue(environment);
  const site_host: string | null = await getEnvironmentValue(siteHost);

  const environmentName: Environment | undefined =
    stringToEnvironment(envString);

  if (environmentName !== undefined && site_host !== null) {
    APIConfig.setSiteHost(site_host);
    APIConfig.setEnvironment(environmentName);
  } else {
    await StorageService.storeData(environment, Environment.Dev);
    await StorageService.storeData(siteHost, defaultSiteHost);
    APIConfig.setSiteHost(defaultSiteHost);
    APIConfig.setEnvironment(Environment.Dev);
  }
}

export const formatPoints = (points: number) => {
  if (points >= 1000000) {
    const millions = points / 1000000;
    return millions % 1 === 0
      ? `${millions}M`
      : `${millions.toFixed(1).replace(/\.0$/, '')}M`;
  } else if (points >= 10000) {
    return `${Math.floor(points / 1000)}K`;
  }
  return points;
};

export const getContentIcon = (ContentType: string) => {
  switch (ContentType) {
    case CardTypes.Article:
      return icons.articleIcon
    case CardTypes.EventDetails:
      return icons.EventIcon
    case CardTypes.Poll:
      return icons.pollIcon
    case CardTypes.Quiz:
      return icons.quizIcon
    case CardTypes.Video:
      return icons.VODIcon
    case 'percentage': 
      return icons.percentIcon
    case 'money':
      return icons.moneyCoin
    case 'wheel':
      return icons.wheelIcon
  } 

}