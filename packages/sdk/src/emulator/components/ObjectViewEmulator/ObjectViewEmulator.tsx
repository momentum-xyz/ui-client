/* eslint-disable @typescript-eslint/no-unused-vars */
import {FC, useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {Panel, ErrorBoundary, ThemeInterface} from '@momentum-xyz/ui-kit';

import {useAttributesEmulator} from '../../hooks';
import {useTheme} from '../../../contexts/ThemeContext';
import {PluginPropsInterface, PluginInterface, Transform} from '../../../interfaces';
import {ObjectGlobalPropsContextProvider} from '../../../contexts';

import * as styled from './ObjectViewEmulator.styled';

interface PropsInterface {
  plugin: PluginInterface;
  isAdmin: boolean;
  onClose: () => void;
}

export const ObjectViewEmulator: FC<PropsInterface> = ({plugin, isAdmin, onClose}) => {
  const {objectId} = useParams<{objectId: string}>();
  console.log('RENDER ObjectViewEmulator', {plugin, objectId});

  return <div>Under construction! Use Odyssey UI for testing</div>;

  // const theme = useTheme();
  // const {
  //   spaceAttributes,
  //   useAttributeItemChange,
  //   useAttributeItemRemove,
  //   subscribeToTopic,
  //   unsubscribeFromTopic
  // } = useAttributesEmulator();

  // const config = useMemo(
  //   () =>
  //     ({
  //       APP_ID: ''
  //     } as any),
  //   []
  // );

  // const coreProps: PluginPropsInterface = useMemo(
  //   () => ({
  //     theme: theme as ThemeInterface,
  //     isAdmin,
  //     objectId,
  //     pluginApi: {
  //       getStateItem: <T,>(key: string) => {
  //         const state = spaceAttributes.current.find(
  //           ({attributeName}) => attributeName === 'state'
  //         )?.attributeValue;

  //         if (!state) {
  //           return Promise.reject();
  //         }

  //         return Promise.resolve(state[key] as T);
  //       },
  //       setStateItem: <T,>(key: string, value: T) => {
  //         const state = spaceAttributes.current.find(
  //           ({attributeName}) => attributeName === 'state'
  //         )?.attributeValue;

  //         if (!state) {
  //           return Promise.reject();
  //         }
  //         state[key] = value;
  //         return Promise.resolve(state[key] as T);
  //       },
  //       getConfig: () => Promise.resolve(config),
  //       deleteStateItem: (key) => {
  //         const state = spaceAttributes.current.find(
  //           ({attributeName}) => attributeName === 'state'
  //         )?.attributeValue;

  //         if (!state) {
  //           return Promise.reject();
  //         }

  //         delete state[key];
  //         return Promise.resolve(null);
  //       },

  //       subscribeToStateUsingTopic: subscribeToTopic,
  //       unsubscribeFromStateUsingTopic: unsubscribeFromTopic,

  //       useStateItemChange: (key, callback) => useAttributeItemChange('', 'state', key, callback),
  //       useStateItemRemove: (key, callback) => useAttributeItemRemove('', 'state', key, callback),

  //       on: (handlers) => {
  //         console.log('on', {handlers});
  //         return () => {};
  //       },

  //       requestObjectLock: (objectId: string) => {
  //         return Promise.resolve();
  //       },
  //       requestObjectUnlock: (objectId: string) => {},

  //       transformObject: (objectId: string, transform: Transform) => {
  //         console.log('transformObject', {objectId, transform});
  //         return Promise.resolve();
  //       }
  //     },
  //     onClose
  //   }),
  //   [
  //     theme,
  //     objectId,
  //     subscribeToTopic,
  //     unsubscribeFromTopic,
  //     useAttributeItemChange,
  //     useAttributeItemRemove,
  //     spaceAttributes,
  //     config,
  //     onClose,
  //     isAdmin
  //   ]
  // );

  // return (
  //   <ErrorBoundary errorMessage="Error while rendering plugin">
  //     <ObjectGlobalPropsContextProvider props={coreProps}>
  //       <styled.Container>
  //         <PluginInnerWrapper pluginProps={coreProps} plugin={plugin} />
  //       </styled.Container>
  //     </ObjectGlobalPropsContextProvider>
  //   </ErrorBoundary>
  // );
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
      <Panel
        variant="primary"
        size="normal"
        title={objectView.title || ''}
        // subtitle={objectView.subtitle}
        // actions={objectView.actions}
        onClose={pluginProps.onClose}
      >
        {objectView.content}
      </Panel>
    )) || <div>usePlugin doesn't return the expected values. Please check the docs</div>
  );
};
