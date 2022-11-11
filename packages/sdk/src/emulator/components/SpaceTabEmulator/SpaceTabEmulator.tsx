import {FC, useCallback, useMemo} from 'react';
import {ErrorBoundary, ThemeInterface} from '@momentum-xyz/ui-kit';

import {useAttributesEmulator} from '../../hooks';
import {useTheme} from '../../../contexts/ThemeContext';
import {
  AttributeValueInterface,
  CorePluginPropsInterface,
  PluginInterface
} from '../../../interfaces';
import {SpaceGlobalPropsContextProvider} from '../../../contexts';

interface PropsInterface {
  plugin: PluginInterface;
  spaceId: string;
  setTopBar: (topBar: JSX.Element) => void;
}

export const SpaceTabEmulator: FC<PropsInterface> = ({plugin, spaceId, setTopBar}) => {
  console.log('RENDER SpaceTabEmulator', {plugin});
  const theme = useTheme();
  const {
    spaceAttributes,
    onAttributeChange,
    onAttributeRemove,
    onAttributeItemChange,
    onAttributeItemRemove,
    changedAttribute,
    removedAttribute,
    changedAttributeItem,
    removedAttributeItem,
    subscribeToTopic
  } = useAttributesEmulator();

  const config = useMemo(
    () => ({
      APP_ID: ''
    }),
    []
  );

  const coreProps: CorePluginPropsInterface = useMemo(
    () => ({
      theme: theme as ThemeInterface,
      isSpaceAdmin: false,
      spaceId,
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

        getSpaceAttributeItem: <T,>(spaceId: string, attributeName: string, key: string) => {
          const attributeValue = spaceAttributes.current.find(
            (attribute) => attribute.attributeName === attributeName
          )?.attributeValue;

          if (!attributeValue) {
            return Promise.reject();
          }

          return Promise.resolve(attributeValue[key] as T);
        },
        setSpaceAttributeItem: <T,>(
          spaceId: string,
          attributeName: string,
          key: string,
          value: T
        ) => {
          const attributeValue = spaceAttributes.current.find(
            (attribute) => attribute.attributeName === attributeName
          )?.attributeValue;

          if (!attributeValue) {
            return Promise.reject();
          }

          attributeValue[key] = value;
          changedAttributeItem({attributeName, key, value});
          return Promise.resolve(attributeValue[key] as T);
        },
        deleteSpaceAttributeItem: (spaceId: string, attributeName, key) => {
          const attributeValue = spaceAttributes.current.find(
            (attribute) => attribute.attributeName === attributeName
          )?.attributeValue;

          if (!attributeValue) {
            return Promise.reject();
          }

          delete attributeValue[key];
          removedAttributeItem({attributeName, key});
          return Promise.resolve(null);
        },

        subscribeToTopic,
        onAttributeChange,
        onAttributeRemove,

        onAttributeItemChange,
        onAttributeItemRemove
      },
      stateApi: {
        getItem: <T,>(key: string) => {
          const state = spaceAttributes.current.find(
            ({attributeName}) => attributeName === 'state'
          )?.attributeValue;

          if (!state) {
            return Promise.reject();
          }

          return Promise.resolve(state[key] as T);
        },
        setItem: <T,>(key: string, value: T) => {
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
        deleteItem: (key) => {
          const state = spaceAttributes.current.find(
            ({attributeName}) => attributeName === 'state'
          )?.attributeValue;

          if (!state) {
            return Promise.reject();
          }

          delete state[key];
          return Promise.resolve(null);
        }
      }
    }),
    [
      changedAttribute,
      changedAttributeItem,
      config,
      onAttributeChange,
      onAttributeItemChange,
      onAttributeItemRemove,
      onAttributeRemove,
      removedAttribute,
      removedAttributeItem,
      spaceAttributes,
      subscribeToTopic,
      theme,
      spaceId
    ]
  );

  const renderTopBarActions = useCallback(
    ({main}) => {
      setTopBar(main());
    },
    [setTopBar]
  );

  return (
    <>
      {!!plugin.SpaceExtension && (
        <ErrorBoundary errorMessage="Error while rendering plugin">
          <SpaceGlobalPropsContextProvider
            props={{
              ...coreProps,
              renderTopBarActions
            }}
          >
            <plugin.SpaceExtension />
          </SpaceGlobalPropsContextProvider>
        </ErrorBoundary>
      )}
    </>
  );
};
