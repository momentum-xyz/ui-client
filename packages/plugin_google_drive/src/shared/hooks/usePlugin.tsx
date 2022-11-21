import {
  PluginApiInterface,
  UsePluginHookType,
  SpaceGlobalPropsContextProvider,
  ObjectPluginPropsInterface
} from '@momentum-xyz/sdk';
import {AppConfigInterface} from 'core/interfaces';
import {GoogleDrivePage} from 'pages';
import {GoogleDriveActions} from 'pages/GoogleDrivePage/components/atoms';
import {useMemo, useEffect} from 'react';
import {RootGoogleDriveStore} from 'stores';
import {GoogleDriveStore} from 'stores/GoogleDriveStore';
import {ThemeProvider} from 'styled-components';

import {useGooglePicker} from './useGooglePicker';
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
  const {googleDriveStore} = store;
  const {googleDocument} = googleDriveStore;

  useEffect(() => {
    if (props.spaceId) {
      store.init(props.spaceId);
    }
  }, [store, props.spaceId]);

  const {pickDocument} = useGooglePicker(googleDriveStore.pickGoogleDocument);

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

  const subtitle = useMemo(() => {
    return googleDocument?.name;
  }, [googleDocument?.name]);

  const topBar = useMemo(() => {
    return (
      <GoogleDriveActions
        spaceId={props.spaceId}
        isAdmin={props.isSpaceAdmin}
        googleDocument={googleDocument}
        pickDocument={pickDocument}
        closeDocument={() => {
          if (!props.spaceId) {
            return;
          }
          googleDriveStore.closeDocument();
        }}
      />
    );
  }, [googleDocument, googleDriveStore, pickDocument, props.isSpaceAdmin, props.spaceId]);

  return {content, subtitle, topBar};
};
