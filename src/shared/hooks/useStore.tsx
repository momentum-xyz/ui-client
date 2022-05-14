import {createContext, useContext} from 'react';

import {RootStoreInterface} from 'stores';

const StoreContext = createContext<RootStoreInterface>({} as RootStoreInterface);

export const useStore = () => useContext(StoreContext);
export const StoreProvider = StoreContext.Provider;
