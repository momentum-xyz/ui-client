import {createContext, useContext} from 'react';
import {RootStoreType} from 'stores';

const StoreContext = createContext<RootStoreType>({} as RootStoreType);

export const useStore = () => useContext(StoreContext);
export const StoreProvider = StoreContext.Provider;
