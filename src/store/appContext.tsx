/* eslint-disable @typescript-eslint/no-shadow */
// AppContext.tsx
import {
  addToCartArray,
  cartID,
  geoLocation,
  loginInfo,
  orderedProduct,
} from '@app/constants/constants';
import {AppConfigData} from '@app/model/appConfig';
import {GeoLocationData} from '@app/model/geoLocationData';
import {LoginResponse} from '@app/model/login';
import fetchAppConfig, {
  getGeoLocationData,
} from '@app/services/appConfigService';
import StorageService from '@app/utils/storageService';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

// Define the type for the context
type AppContextType = {
  userInfo: LoginResponse | undefined;
  appConfigData: AppConfigData | null;
  geoLocationData: GeoLocationData | undefined;

  addConfigData: (appConfig: AppConfigData) => void;
  addGeoLocationData: (locationData: GeoLocationData) => void;

  addUserData: (userData: LoginResponse) => void;
  logout: () => void;

  cartItems: any[];
  setCartItems: any;
  addToCart: (item: any) => void;
  removeFromCart: (itemId: string) => void;
  isInCart: any;
  orders: any[];
  confirmOrder: () => void;
};

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create custom hooks for accessing the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Define the props for the context provider
type AppProviderProps = {
  children: ReactNode;
};

// Create the context provider component
export const AppProvider: React.FC<AppProviderProps> = ({children}) => {
  // Define the initial state for user authentication
  const [userInfo, setUserInfo] = useState<LoginResponse | undefined>(
    undefined,
  );
  const [appConfigData, setAppConfigData] = useState<AppConfigData | null>(
    null,
  );
  const [geoLocationData, setGeoLocationData] = useState<
    GeoLocationData | undefined
  >(undefined);
  const [cartItems, setCartItems] = useState<any>([]);
  const [isInCart, setIsInCart] = useState<any>({});
  const [orders, setOrders] = useState<any>([]);

  const loadCartItems = async () => {
    try {
      const storedCartItems = await StorageService.getData(addToCartArray);
      if (storedCartItems) {
        const parsedCartItems = Object.values(JSON.parse(storedCartItems));
        setCartItems(parsedCartItems);
        const isInCartStatus = parsedCartItems.reduce(
          (acc: any, currentItem: any) => {
            acc[currentItem.id] = true;
            return acc;
          },
          {},
        );
        setIsInCart(isInCartStatus);
      }
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const loadOrderedItems = async () => {
    const items = await StorageService.getData(orderedProduct);
    if (items) {
      setOrders(JSON.parse(items));
    }
  };

  const confirmOrder = async () => {
    setOrders([...orders, ...cartItems]);
    setCartItems([]);
    setIsInCart({});
    await StorageService.clearData(cartID);
    await StorageService.storeData(addToCartArray, JSON.stringify([]));
    await StorageService.storeData(
      orderedProduct,
      JSON.stringify([...orders, ...cartItems]),
    );
  };

  const addToCart = async (item: any) => {
    const isItemCart = cartItems.some(
      (cartItem: any) => cartItem.id === item.id,
    );
    if (!isItemCart) {
      const newCartItems = [...cartItems, item];
      setCartItems(newCartItems);
      setIsInCart({...isInCart, [item.id]: true});
      await updateCartStorage(newCartItems);
    } else {
      console.log('Item is already in the cart.');
    }
  };

  const updateCartStorage = async (cartItems: any[]) => {
    try {
      await StorageService.storeData(
        addToCartArray,
        JSON.stringify(
          cartItems.reduce((acc, currentItem) => {
            acc[currentItem.id] = currentItem;
            return acc;
          }, {}),
        ),
      );
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const removeFromCart = async (itemId: string) => {
    const updatedCartItems = cartItems.filter(
      (item: any) => item.id !== itemId,
    );
    setCartItems(updatedCartItems);
    setIsInCart({...isInCart, [itemId]: false});
    await updateCartStorage(updatedCartItems);
  };

  // Define functions to update the states
  const addUserData = async (userData: LoginResponse) => {
    setUserInfo(userData);
    await StorageService.storeData(loginInfo, JSON.stringify(userData));
  };

  const logout = () => setUserInfo(undefined);
  const addConfigData = (appConfig: AppConfigData) =>
    setAppConfigData(appConfig);
  const addGeoLocationData = (locationData: GeoLocationData) =>
    setGeoLocationData(locationData);

  useEffect(() => {
    assignLocalStoredUserData();
    getAppConfigData();
    fetchGeoLocationData();
    loadCartItems();
    loadOrderedItems();
  }, []);

  async function assignLocalStoredUserData() {
    const storedLoginData = await StorageService.getData(loginInfo);
    if (storedLoginData) {
      const infoObject = await JSON.parse(storedLoginData);
      setUserInfo(infoObject);
    }
  }

  async function getAppConfigData() {
    fetchAppConfig()
      .then(data => {
        addConfigData(data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  async function fetchGeoLocationData() {
    getGeoLocationData()
      .then(location => {
        addGeoLocationData(location);
        StorageService.storeData(geoLocation, JSON.stringify(location));
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <AppContext.Provider
      value={{
        userInfo,
        addUserData,
        logout,
        appConfigData,
        addConfigData,
        geoLocationData,
        addGeoLocationData,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        isInCart,
        orders,
        confirmOrder,
      }}>
      {children}
    </AppContext.Provider>
  );
};

// Usage
/*
import {useAppContext} from '@app/store/appContext';
const ProfileScreen: React.FC = () => {
  const [item, setItem] = useState<string>('');
  const {user, logout, addItem} = useAppContext();
  const handleAddItem = () => {
    // Validate and process the item data
    if (item.trim() !== '') {
      addItem({ id: Date.now(), name: item });
      setItem('');
    }
  };

  return (
    <View>
      <Text>Profile Screen</Text>
      {user ? (
        <>
          <Text>Welcome, {user.username}!</Text>
          <Button title="Logout" onPress={logout} />
        </>
      ) : (
        <Text>User not logged in</Text>
      )}
    </View>
  );
}; */
