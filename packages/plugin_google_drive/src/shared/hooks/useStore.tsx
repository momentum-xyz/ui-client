import {createContext, useContext} from 'react';
import {RootGoogleDriveStoreType} from 'stores';

const StoreContext = createContext<RootGoogleDriveStoreType>({} as RootGoogleDriveStoreType);

export const useStore = () => useContext(StoreContext);
export const StoreProvider = StoreContext.Provider;
