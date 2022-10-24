import React, {FC, useContext} from 'react';
import axios from 'axios';
import {createContext} from 'react';
import {DefaultThemeConfig} from '@momentum-xyz/ui-kit';

import {SpacePluginPropsInterface} from '../interfaces';

export const SpaceGlobalPropsContext = createContext<SpacePluginPropsInterface>({
  theme: DefaultThemeConfig,
  isSpaceAdmin: false,
  // TODO: Discuss further
  request: axios.create({
    baseURL: '',
    responseType: 'json',
    headers: {},
    timeout: 0
  }),
  init: () => {
    return Promise.resolve();
  },
  spacePluginState: {},
  setPluginSpaceStateSubField: () => {
    return Promise.resolve();
  }
});

export const SpaceGlobalPropsContextProvider: FC<{props: SpacePluginPropsInterface}> = ({
  props,
  children
}) => <SpaceGlobalPropsContext.Provider value={props}>{children}</SpaceGlobalPropsContext.Provider>;

export const useSpaceGlobalProps = () => useContext(SpaceGlobalPropsContext);
