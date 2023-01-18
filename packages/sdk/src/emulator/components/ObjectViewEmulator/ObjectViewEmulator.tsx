import React, {FC, useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {ErrorBoundary, ThemeInterface, WindowPanel} from '@momentum-xyz/ui-kit';

import {useAttributesEmulator} from '../../hooks';
import {useTheme} from '../../../contexts/ThemeContext';
import {AttributeValueInterface, PluginPropsInterface, PluginInterface} from '../../../interfaces';
import {ObjectGlobalPropsContextProvider} from '../../../contexts';

import * as styled from './ObjectViewEmulator.styled';

interface PropsInterface {
  plugin: PluginInterface;
  onClose: () => void;
}

export const ObjectViewEmulator: FC<PropsInterface> = ({plugin, onClose}) => {
  const {objectId} = useParams<{objectId: string}>();
  console.log('RENDER ObjectViewEmulator', {plugin, objectId});

  const theme = useTheme();
  const {
    spaceAttributes,
    useAttributeChange,
    useAttributeRemove,
    useAttributeItemChange,
    useAttributeItemRemove,
    changedAttribute,
    removedAttribute,
    changedAttributeItem,
    removedAttributeItem,
    subscribeToTopic,
    unsubscribeFromTopic
  } = useAttributesEmulator();

  const config = useMemo(
    () =>
      ({
        APP_ID: ''
      } as any),
    []
  );

  const coreProps: PluginPropsInterface = useMemo(
    () => ({
      theme: theme as ThemeInterface,
      isAdmin: true,
      objectId,
      api: {
        getSpaceAttributeValue: <T extends AttributeValueInterface>(
          spaceId: string,
          attributeName: string
        ) => {
          const attributeValue = spaceAttributes.current.find(
            (attribute) => attribute.attributeName === attributeName
          )?.attributeValue;

          if (!attributeValue) {
            return Promise.reject();
          }

          return Promise.resolve(attributeValue as T);
        },
        setSpaceAttributeValue: <T extends AttributeValueInterface>(
          spaceId: string,
          attributeName: string,
          value: AttributeValueInterface
        ) => {
          const attribute = spaceAttributes.current.find(
            (attribute) => attribute.attributeName === attributeName
          );

          if (!attribute) {
            return Promise.reject();
          }

          attribute.attributeValue = value;
          changedAttribute({attributeName, value});
          return Promise.resolve(attribute.attributeValue as T);
        },
        deleteSpaceAttribute: (spaceId: string, attributeName) => {
          const attributes = spaceAttributes.current.filter(
            (attribute) => attribute.attributeName !== attributeName
          );

          spaceAttributes.current = attributes;
          removedAttribute({attributeName});
          return Promise.resolve(null);
        },

        getSpaceAttributeItem: <T,>(
          spaceId: string,
          attributeName: string,
          attributeItemName: string
        ) => {
          const attributeValue = spaceAttributes.current.find(
            (attribute) => attribute.attributeName === attributeName
          )?.attributeValue;

          if (!attributeValue) {
            return Promise.reject();
          }

          return Promise.resolve(attributeValue[attributeItemName] as T);
        },
        setSpaceAttributeItem: <T,>(
          spaceId: string,
          attributeName: string,
          attributeItemName: string,
          value: T
        ) => {
          const attributeValue = spaceAttributes.current.find(
            (attribute) => attribute.attributeName === attributeName
          )?.attributeValue;

          if (!attributeValue) {
            return Promise.reject();
          }

          attributeValue[attributeItemName] = value;
          changedAttributeItem({attributeName, attributeItemName, value});
          return Promise.resolve(attributeValue[attributeItemName] as T);
        },
        deleteSpaceAttributeItem: (spaceId: string, attributeName, attributeItemName) => {
          const attributeValue = spaceAttributes.current.find(
            (attribute) => attribute.attributeName === attributeName
          )?.attributeValue;

          if (!attributeValue) {
            return Promise.reject();
          }

          delete attributeValue[attributeItemName];
          removedAttributeItem({attributeName, attributeItemName});
          return Promise.resolve(null);
        },

        subscribeToTopic,
        unsubscribeFromTopic,

        useAttributeChange,
        useAttributeRemove,

        useAttributeItemChange,
        useAttributeItemRemove
      },
      pluginApi: {
        getStateItem: <T,>(key: string) => {
          const state = spaceAttributes.current.find(
            ({attributeName}) => attributeName === 'state'
          )?.attributeValue;

          if (!state) {
            return Promise.reject();
          }

          return Promise.resolve(state[key] as T);
        },
        setStateItem: <T,>(key: string, value: T) => {
          const state = spaceAttributes.current.find(
            ({attributeName}) => attributeName === 'state'
          )?.attributeValue;

          if (!state) {
            return Promise.reject();
          }
          state[key] = value;
          return Promise.resolve(state[key] as T);
        },
        getConfig: () => Promise.resolve(config),
        deleteStateItem: (key) => {
          const state = spaceAttributes.current.find(
            ({attributeName}) => attributeName === 'state'
          )?.attributeValue;

          if (!state) {
            return Promise.reject();
          }

          delete state[key];
          return Promise.resolve(null);
        },

        subscribeToStateUsingTopic: subscribeToTopic,
        unsubscribeFromStateUsingTopic: unsubscribeFromTopic,

        useStateItemChange: (key, callback) => useAttributeItemChange('', 'state', key, callback),
        useStateItemRemove: (key, callback) => useAttributeItemRemove('', 'state', key, callback)
      },
      onClose
    }),
    [
      theme,
      objectId,
      subscribeToTopic,
      unsubscribeFromTopic,
      useAttributeChange,
      useAttributeRemove,
      useAttributeItemChange,
      useAttributeItemRemove,
      spaceAttributes,
      changedAttribute,
      removedAttribute,
      changedAttributeItem,
      removedAttributeItem,
      config,
      onClose
    ]
  );

  return (
    <ErrorBoundary errorMessage="Error while rendering plugin">
      <ObjectGlobalPropsContextProvider props={coreProps}>
        <styled.Container>
          <PluginInnerWrapper pluginProps={coreProps} plugin={plugin} />
        </styled.Container>
      </ObjectGlobalPropsContextProvider>
    </ErrorBoundary>
  );
};

const PluginInnerWrapper = ({
  pluginProps,
  plugin
}: {
  pluginProps: PluginPropsInterface;
  plugin: PluginInterface;
}) => {
  const {content, objectView} = plugin.usePlugin(pluginProps);

  return (
    content ||
    (objectView && (
      <WindowPanel
        title={objectView.title || ''}
        subtitle={objectView.subtitle}
        actions={objectView.actions}
        onClose={pluginProps.onClose}
      >
        {objectView.content}
      </WindowPanel>
    )) || <div>usePlugin doesn't return the expected values. Please check the docs</div>
  );
};
