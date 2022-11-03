import {createContext, useContext} from 'react';
import {RootMiroStoreType} from 'stores';

const StoreContext = createContext<RootMiroStoreType>({} as RootMiroStoreType);

export const useStore = () => useContext(StoreContext);
export const StoreProvider = StoreContext.Provider;
