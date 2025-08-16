import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  // Store data in AsyncStorage
  static async storeData(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  }

  // Retrieve data from AsyncStorage
  static async getData(key: string): Promise<string | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      console.error('Error getting data:', error);
      return null;
    }
  }

  // Clear data from AsyncStorage
  static async clearData(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}

export default StorageService;
