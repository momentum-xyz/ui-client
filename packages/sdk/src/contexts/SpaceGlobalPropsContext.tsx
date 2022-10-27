import React, {FC, useContext} from 'react';
import {createContext} from 'react';
import {DefaultThemeConfig} from '@momentum-xyz/ui-kit';

import {SpacePluginPropsInterface} from '../interfaces';

export const SpaceGlobalPropsContext = createContext<SpacePluginPropsInterface>({
  theme: DefaultThemeConfig,
  isSpaceAdmin: false,
  api: {
    get: () => Promise.reject(),
    set: () => Promise.reject()
  }
});

export const SpaceGlobalPropsContextProvider: FC<{props: SpacePluginPropsInterface}> = ({
  props,
  children
}) => <SpaceGlobalPropsContext.Provider value={props}>{children}</SpaceGlobalPropsContext.Provider>;

export const useSpaceGlobalProps = () => useContext(SpaceGlobalPropsContext);
