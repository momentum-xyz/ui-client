import {AppConfigInterface} from 'core/interfaces';
import {FC, useMemo, useEffect} from 'react';
import {RootGoogleDriveStore} from 'stores';
import {ThemeProvider as ThemeProviderOriginal, ThemeProviderProps} from 'styled-components';
import {UsePluginHookType} from '@momentum-xyz/sdk';

import {GoogleDriveStore} from 'stores/GoogleDriveStore';
import {GoogleDrivePage} from 'pages';

import {StoreProvider} from './useStore';

const ThemeProvider = ThemeProviderOriginal as unknown as FC<ThemeProviderProps<any>>;

export const usePlugin: UsePluginHookType<AppConfigInterface> = (props) => {
  const store = useMemo(
    () =>
      RootGoogleDriveStore.create({
        api: props.pluginApi,
        googleDriveStore: GoogleDriveStore.create({
          api: props.pluginApi
        })
      }),
    [props.pluginApi]
  );

  useEffect(() => {
    if (props.objectId) {
      store.init(props.objectId);
    }
  }, [store, props.objectId]);

  const content = (
    <ThemeProvider theme={props.theme}>
      <StoreProvider value={store}>
        <GoogleDrivePage />
      </StoreProvider>
    </ThemeProvider>
  );

  return {content};
};
