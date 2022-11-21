import {PluginApiInterface, UsePluginHookType} from '@momentum-xyz/sdk';
import {SpaceGlobalPropsContextProvider} from '@momentum-xyz/sdk/dist/contexts/SpaceGlobalPropsContext';
import {AppConfigExtendedInterface, AppConfigInterface} from 'core/interfaces';
import {GoogleDrivePage} from 'pages';
import {GoogleDriveActions} from 'pages/GoogleDrivePage/components/atoms';
import {useMemo, useEffect} from 'react';
import {RootGoogleDriveStore} from 'stores';
import {GoogleDriveStore} from 'stores/GoogleDriveStore';
import {ThemeProvider} from 'styled-components';

import {useGooglePicker} from './useGooglePicker';
import {StoreProvider} from './useStore';

export const usePlugin: UsePluginHookType<AppConfigExtendedInterface> = (props) => {
  const store = useMemo(
    () =>
      RootGoogleDriveStore.create({
        api: props.pluginApi as PluginApiInterface<AppConfigInterface>,
        googleDriveStore: GoogleDriveStore.create({
          api: props.pluginApi as PluginApiInterface<AppConfigInterface>
        })
      }),
    [props.pluginApi]
  );
  const {googleDriveStore} = store;
  const {googleDocument} = googleDriveStore;

  useEffect(() => {
    store.init();
  }, [store]);

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
