import React, {FC, useContext} from 'react';
import {createContext} from 'react';
import {DefaultThemeConfig} from '@momentum-xyz/ui-kit';

import {PluginConfigInterface, SpacePluginPropsInterface} from '../interfaces';

import {ThemeContextProvider} from './ThemeContext';

export const SpaceGlobalPropsContext = createContext<
  SpacePluginPropsInterface<PluginConfigInterface>
>({
  theme: DefaultThemeConfig,
  isSpaceAdmin: false,
  api: {
    getSpaceAttributeValue: () => Promise.reject(),
    setSpaceAttributeValue: () => Promise.reject(),
    deleteSpaceAttribute: () => Promise.reject(),

    getSpaceAttributeItem: () => Promise.reject(),
    setSpaceAttributeItem: () => Promise.reject(),
    deleteSpaceAttributeItem: () => Promise.reject(),

    subscribeToTopic: () => Promise.reject(),
    onAttributeChange: () => Promise.reject(),
    onAttributeRemove: () => Promise.reject(),

    onAttributeValueSubValueChange: () => Promise.reject(),
    onAttributeValueSubValueRemove: () => Promise.reject()
  },
  stateApi: {
    getItem: () => Promise.reject(),
    setItem: () => Promise.reject(),
    getConfig: () => Promise.reject(),
    deleteItem: () => Promise.reject()
  },
  renderTopBarActions() {}
});

export const SpaceGlobalPropsContextProvider: FC<{
  props: SpacePluginPropsInterface<PluginConfigInterface>;
}> = ({props, children}) => (
  <SpaceGlobalPropsContext.Provider value={props}>
    <ThemeContextProvider theme={props.theme}>{children}</ThemeContextProvider>
  </SpaceGlobalPropsContext.Provider>
);

export const useSpaceGlobalProps = () => useContext(SpaceGlobalPropsContext);
