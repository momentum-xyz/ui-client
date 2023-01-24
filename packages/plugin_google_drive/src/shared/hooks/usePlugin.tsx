import {
  PluginApiInterface,
  UsePluginHookType,
  ObjectGlobalPropsContextProvider,
  ObjectPluginPropsInterface
} from '@momentum-xyz/sdk';
import {AppConfigInterface} from 'core/interfaces';
import {GoogleDrivePage} from 'pages';
import {useMemo, useEffect} from 'react';
import {RootGoogleDriveStore} from 'stores';
import {GoogleDriveStore} from 'stores/GoogleDriveStore';
import {ThemeProvider as ThemeProviderOriginal, ThemeProviderProps} from 'styled-components';

import {StoreProvider} from './useStore';

const ThemeProvider = ThemeProviderOriginal as unknown as React.FC<ThemeProviderProps<any>>;

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
      <ObjectGlobalPropsContextProvider props={props}>
        <ThemeProvider theme={props.theme}>
          <StoreProvider value={store}>
            <GoogleDrivePage />
          </StoreProvider>
        </ThemeProvider>
      </ObjectGlobalPropsContextProvider>
    );
  }, [props, store]);

  return {content};
};
