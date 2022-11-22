import {
  PluginApiInterface,
  UsePluginHookType,
  SpaceGlobalPropsContextProvider,
  ObjectPluginPropsInterface
} from '@momentum-xyz/sdk';
import {AppConfigInterface} from 'core/interfaces';
import {GoogleDrivePage} from 'pages';
import {useMemo, useEffect} from 'react';
import {RootGoogleDriveStore} from 'stores';
import {GoogleDriveStore} from 'stores/GoogleDriveStore';
import {ThemeProvider} from 'styled-components';

import {StoreProvider} from './useStore';

export const usePlugin: UsePluginHookType<ObjectPluginPropsInterface> = (props) => {
  const store = useMemo(
    () =>
      RootGoogleDriveStore.create({
        api: props.pluginApi as PluginApiInterface<AppConfigInterface>,
        attributesApi: props.api,
        googleDriveStore: GoogleDriveStore.create({
          api: props.pluginApi as PluginApiInterface<AppConfigInterface>
        })
      }),
    [props.api, props.pluginApi]
  );

  useEffect(() => {
    if (props.objectId) {
      store.init(props.objectId);
    }
  }, [store, props.objectId]);

  const content = useMemo(() => {
    return (
      <SpaceGlobalPropsContextProvider props={props}>
        <ThemeProvider theme={props.theme}>
          <StoreProvider value={store}>
            <GoogleDrivePage />
          </StoreProvider>
        </ThemeProvider>
      </SpaceGlobalPropsContextProvider>
    );
  }, [props, store]);

  return {content};
};
