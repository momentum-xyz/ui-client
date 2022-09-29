import React, {FC, useContext} from 'react';
import axios from 'axios';
import {createContext} from 'react';
import {SpacePluginPropsInterface} from 'core/interfaces';
import {DefaultThemeConfig} from '@momentum/ui-kit';

export const GlobalPropsContext = createContext<SpacePluginPropsInterface>({
  theme: DefaultThemeConfig,
  isSpaceAdmin: false,
  request: axios.create({
    baseURL: '',
    responseType: 'json',
    headers: {},
    timeout: 0
  })
});

export const GlobalPropsContextProvider: FC<{props: SpacePluginPropsInterface}> = ({
  props,
  children
}) => <GlobalPropsContext.Provider value={props}>{children}</GlobalPropsContext.Provider>;

export const useGlobalProps = () => useContext(GlobalPropsContext);
