import {FC, useContext, PropsWithChildren} from 'react';
import {createContext} from 'react';
import {DefaultThemeConfig} from '@momentum-xyz/ui-kit';

import {PluginPropsInterface, Transform} from '../interfaces';

import {ThemeContextProvider} from './ThemeContext';

export const ObjectGlobalPropsContext = createContext<PluginPropsInterface>({
  theme: DefaultThemeConfig,
  isAdmin: false,
  pluginApi: {
    getStateItem: () => Promise.reject(),
    setStateItem: () => Promise.reject(),
    getConfig: () => Promise.reject(),
    deleteStateItem: () => Promise.reject(),

    useStateItemChange: () => Promise.reject(),
    useStateItemRemove: () => Promise.reject(),

    on: (handlers) => {
      throw new Error('Method not implemented.');
    },
    requestObjectLock: (objectId: string) => Promise.reject(),
    requestObjectUnlock: (objectId: string) => {
      throw new Error('Method not implemented.');
    },

    spawnObject: ({
      name,
      asset_2d_id,
      asset_3d_id,
      transform,
      object_type_id
    }: {
      name: string;
      asset_2d_id?: string | null;
      asset_3d_id: string | null;
      object_type_id?: string;
      transform?: Transform;
    }) => Promise.reject(),
    transformObject(objectId, transform) {
      throw new Error('Method not implemented.');
    },
    getObjectInfo: (objectId: string) => Promise.reject(),
    removeObject: (objectId: string) => Promise.reject(),
    getSupportedAssets3d: (category: 'basic' | 'custom') => Promise.reject(),

    setObjectAttribute: (props: {
      name: string;
      value: any;
      objectId: string;
      // pluginId?: string
    }) => Promise.reject(),

    removeObjectAttribute: ({
      name,
      objectId,
      pluginId
    }: {
      name: string;
      objectId: string;
      pluginId?: string;
    }) => Promise.reject(),
    getObjectAttribute: ({
      name,
      objectId,
      pluginId
    }: {
      name: string;
      objectId: string;
      pluginId?: string;
    }) => Promise.reject(),
    setObjectColor(objectId, color) {
      throw new Error('Method not implemented.');
    },
    setObjectName(objectId, name) {
      throw new Error('Method not implemented.');
    }
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
