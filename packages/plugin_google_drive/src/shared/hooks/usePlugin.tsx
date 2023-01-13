import {UsePluginHookType} from '@momentum-xyz/sdk';
import {AppConfigInterface} from 'core/interfaces';
import {GoogleDrivePage} from 'pages';
import {useMemo, useEffect} from 'react';
import {RootGoogleDriveStore} from 'stores';
import {GoogleDriveStore} from 'stores/GoogleDriveStore';
import {ThemeProvider} from 'styled-components';

import {StoreProvider} from './useStore';

export const usePlugin: UsePluginHookType<AppConfigInterface> = (props) => {
  const store = useMemo(
    () =>
      RootGoogleDriveStore.create({
        api: props.pluginApi,
        attributesApi: props.api,
        googleDriveStore: GoogleDriveStore.create({
          api: props.pluginApi
        })
      }),
    [props.api, props.pluginApi]
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
