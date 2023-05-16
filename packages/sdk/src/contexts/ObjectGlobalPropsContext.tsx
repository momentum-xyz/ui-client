import {FC, useContext, PropsWithChildren} from 'react';
import {createContext} from 'react';
import {DefaultThemeConfig} from '@momentum-xyz/ui-kit-storybook';

import {PluginPropsInterface} from '../interfaces';

import {ThemeContextProvider} from './ThemeContext';

export const ObjectGlobalPropsContext = createContext<PluginPropsInterface>({
  theme: DefaultThemeConfig,
  isAdmin: false,
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
  },
  onClose: () => {}
});

export const ObjectGlobalPropsContextProvider: FC<
  PropsWithChildren<{
    props: PluginPropsInterface;
  }>
> = ({props, children}) => (
  <ObjectGlobalPropsContext.Provider value={props}>
    <ThemeContextProvider theme={props.theme}>{children}</ThemeContextProvider>
  </ObjectGlobalPropsContext.Provider>
);

export const useObjectGlobalProps = () => useContext(ObjectGlobalPropsContext);
