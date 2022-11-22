import React, {FC, useContext} from 'react';
import {createContext} from 'react';
import {DefaultThemeConfig} from '@momentum-xyz/ui-kit';

import {PluginConfigInterface, ObjectPluginPropsInterface} from '../interfaces';

import {ThemeContextProvider} from './ThemeContext';

export const SpaceGlobalPropsContext = createContext<
  ObjectPluginPropsInterface<PluginConfigInterface>
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
    unsubscribeFromTopic: () => Promise.reject(),
    useAttributeChange: () => Promise.reject(),
    useAttributeRemove: () => Promise.reject(),

    useAttributeItemChange: () => Promise.reject(),
    useAttributeItemRemove: () => Promise.reject()
  },
  pluginApi: {
    getStateItem: () => Promise.reject(),
    setStateItem: () => Promise.reject(),
    getConfig: () => Promise.reject(),
    deleteStateItem: () => Promise.reject(),

    useStateItemChange: () => Promise.reject(),
    useStateItemRemove: () => Promise.reject()
  }
});

export const SpaceGlobalPropsContextProvider: FC<{
  props: ObjectPluginPropsInterface<PluginConfigInterface>;
}> = ({props, children}) => (
  <SpaceGlobalPropsContext.Provider value={props}>
    <ThemeContextProvider theme={props.theme}>{children}</ThemeContextProvider>
  </SpaceGlobalPropsContext.Provider>
);

export const useSpaceGlobalProps = () => useContext(SpaceGlobalPropsContext);
