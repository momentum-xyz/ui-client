import React, {FC, useMemo} from 'react';
import {
  ErrorBoundary,
  // ObjectTopBar,
  // SpacePage,
  ThemeInterface,
  WindowPanel
} from '@momentum-xyz/ui-kit';

import {useAttributesEmulator} from '../../hooks';
import {useTheme} from '../../../contexts/ThemeContext';
import {AttributeValueInterface, PluginPropsInterface, PluginInterface} from '../../../interfaces';

interface PropsInterface {
  plugin: PluginInterface;
  objectId: string;
  // isExpanded: boolean;
  // setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

export const SpaceTabEmulator: FC<PropsInterface> = ({
  plugin,
  objectId,
  // isExpanded,
  // setIsExpanded,
  onClose
}) => {
  console.log('RENDER SpaceTabEmulator', {plugin});

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
      isAdmin: false,
      objectId,
      // isExpanded,
      // onToggleExpand: () => setIsExpanded((oldValue) => !oldValue),
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
      // isExpanded,
      subscribeToTopic,
      unsubscribeFromTopic,
      useAttributeChange,
      useAttributeRemove,
      useAttributeItemChange,
      useAttributeItemRemove,
      // setIsExpanded,
      spaceAttributes,
      changedAttribute,
      removedAttribute,
      changedAttributeItem,
      removedAttributeItem,
      config,
      onClose
    ]
  );

  const {content, objectView} = plugin.usePlugin(coreProps);

  return (
    <ErrorBoundary errorMessage="Error while rendering plugin">
      {content ||
        (objectView && (
          <WindowPanel
            title={objectView.title || ''}
            subtitle={objectView.subtitle}
            actions={objectView.actions}
            onClose={onClose}
          >
            {objectView.content}
          </WindowPanel>
        )) || <div>usePlugin doesn't return the expected values. Please check the docs</div>}
    </ErrorBoundary>
  );
};

// <SpacePage>
//   <ObjectTopBar
//     title={objectView.title || ''}
//     subtitle={objectView.subtitle || ''}
//     isExpanded={isExpanded}
//     onClose={onClose}
//     onToggleExpand={() => setIsExpanded((oldValue) => !oldValue)}
//   >
//     {objectView.actions}
//   </ObjectTopBar>
//   {objectView.content}
// </SpacePage>
