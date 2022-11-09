import {FC, useCallback, useMemo, useRef, useState} from 'react';
import {ErrorBoundary, ThemeInterface} from '@momentum-xyz/ui-kit';

import {useTheme} from '../../../contexts/ThemeContext';
import {
  AttributeValueInterface,
  CorePluginPropsInterface,
  PluginInterface
} from '../../../interfaces';
import {SpaceGlobalPropsContextProvider} from '../../../contexts';

import * as styled from './SpaceTabEmulator.styled';

interface PropsInterface {
  plugin: PluginInterface;
}

export const SpaceTabEmulator: FC<PropsInterface> = ({plugin}) => {
  console.log('RENDER SpaceEmulator', {plugin});
  const theme = useTheme();
  const spaceAttributes = useRef<
    Array<{attributeName: string; attributeValue: AttributeValueInterface}>
  >([{attributeName: 'state', attributeValue: {}}]);

  const [subscribed, setSubscribed] = useState(false);
  const [attributeChanged, setAttributeChanged] = useState<{
    attributeName: string;
    value: AttributeValueInterface;
  }>();
  const [attributeRemoved, setAttributeRemoved] = useState<{attributeName: string}>();

  const [attributeSubValueChanged, setAttributeSubValueChanged] = useState<{
    attributeName: string;
    key: string;
    value: unknown;
  }>();
  const [attributeSubValueRemoved, setAttributeSubValueRemoved] = useState<{
    attributeName: string;
    key: string;
  }>();

  const config = useMemo(
    () => ({
      APP_ID: ''
    }),
    []
  );

  const onAttributeChange = useCallback(
    (callback) => {
      setInterval(() => {
        if (attributeChanged && subscribed) {
          callback(attributeChanged.attributeName, attributeChanged.value);
          setAttributeChanged(undefined);
        }
      }, 500);
    },
    [attributeChanged, subscribed]
  );

  const onAttributeRemove = useCallback(
    (callback) => {
      setInterval(() => {
        if (attributeRemoved && subscribed) {
          callback(attributeRemoved.attributeName);
          setAttributeRemoved(undefined);
        }
      }, 500);
    },
    [attributeRemoved, subscribed]
  );

  const onAttributeValueSubValueChange = useCallback(
    (callback) => {
      setInterval(() => {
        if (attributeSubValueChanged && subscribed) {
          callback(
            attributeSubValueChanged.attributeName,
            attributeSubValueChanged.key,
            attributeSubValueChanged.value
          );
          setAttributeSubValueChanged(undefined);
        }
      }, 500);
    },
    [attributeSubValueChanged, subscribed]
  );

  const onAttributeValueSubValueRemove = useCallback(
    (callback) => {
      setInterval(() => {
        if (attributeSubValueRemoved && subscribed) {
          callback(attributeSubValueRemoved.attributeName, attributeSubValueRemoved.key);
          setAttributeSubValueChanged(undefined);
        }
      }, 500);
    },
    [attributeSubValueRemoved, subscribed]
  );

  const coreProps: CorePluginPropsInterface = useMemo(
    () => ({
      theme: theme as ThemeInterface,
      isSpaceAdmin: false,
      spaceId: '42424242-4242-4242-4242-424242424242',
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
          setAttributeChanged({attributeName, value});
          return Promise.resolve(attribute.attributeValue as T);
        },
        deleteSpaceAttribute: (spaceId: string, attributeName) => {
          const attributes = spaceAttributes.current.filter(
            (attribute) => attribute.attributeName !== attributeName
          );

          spaceAttributes.current = attributes;
          setAttributeRemoved({attributeName});
          return Promise.resolve(null);
        },

        getSpaceAttributeValueSubValue: <T,>(
          spaceId: string,
          attributeName: string,
          key: string
        ) => {
          const attributeValue = spaceAttributes.current.find(
            (attribute) => attribute.attributeName === attributeName
          )?.attributeValue;

          if (!attributeValue) {
            return Promise.reject();
          }

          return Promise.resolve(attributeValue[key] as T);
        },
        setSpaceAttributeValueSubValue: <T,>(
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
          setAttributeSubValueChanged({attributeName, key, value});
          return Promise.resolve(attributeValue[key] as T);
        },
        deleteSpaceAttributeValueSubValue: (spaceId: string, attributeName, key) => {
          const attributeValue = spaceAttributes.current.find(
            (attribute) => attribute.attributeName === attributeName
          )?.attributeValue;

          if (!attributeValue) {
            return Promise.reject();
          }

          delete attributeValue[key];
          setAttributeSubValueRemoved({attributeName, key});
          return Promise.resolve(null);
        },

        subscribeToTopic: (topic) => {
          setSubscribed(topic === 'plugin');
          return Promise.resolve();
        },
        onAttributeChange,
        onAttributeRemove,

        onAttributeValueSubValueChange,
        onAttributeValueSubValueRemove
      },
      pluginStateAPI: {
        get: <T,>(key: string) => {
          const state = spaceAttributes.current.find(
            ({attributeName}) => attributeName === 'state'
          )?.attributeValue;

          if (!state) {
            return Promise.reject();
          }

          return Promise.resolve(state[key] as T);
        },
        set: <T,>(key: string, value: T) => {
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
        delete: (key) => {
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
      theme,
      onAttributeChange,
      onAttributeRemove,
      onAttributeValueSubValueChange,
      onAttributeValueSubValueRemove,
      config
    ]
  );

  const [topBar, setTopBar] = useState(<span />);

  const renderTopBarActions = useCallback(
    ({main}) => {
      setTopBar(main());
    },
    [setTopBar]
  );

  return (
    <div>
      <styled.SpaceTopBar>
        <strong>Space / Plugin</strong>
        {topBar}
      </styled.SpaceTopBar>
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
    </div>
  );
};
