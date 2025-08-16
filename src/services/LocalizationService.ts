import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from '@app/resource/languages/en.json';
import nl from '@app/resource/languages/nl.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {language} from '@app/constants/constants';

export const languageResources = {
  en: {translation: en},
  nl: {translation: nl},
};

const initLanguage = async () => {
  try {
    const storedLanguage = await AsyncStorage.getItem(language);
    if (storedLanguage) {
      i18next.changeLanguage(storedLanguage);
    }
  } catch (error) {
    console.error('Error initializing language:', error);
  }
};

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  fallbackLng: 'en',
  resources: languageResources,
});

initLanguage();
export default i18next;
