import React, {FC, useMemo, useEffect} from 'react';
import {ThemeProvider} from 'styled-components';
import {PluginApiInterface, useSpace, useTheme} from '@momentum-xyz/sdk';
import {RootGoogleDriveStore} from 'stores';
import {AppConfigInterface} from 'core/interfaces';
import '@momentum-xyz/ui-kit/dist/themes/themes';
import {StoreProvider} from 'shared/hooks/useStore';
import {GoogleDrivePage} from 'pages';
import {GoogleDriveStore} from 'stores/GoogleDriveStore';

const GoogleDriveApp: FC = () => {
  const theme = useTheme();
  const {pluginApi} = useSpace();

  const store = useMemo(
    () =>
      RootGoogleDriveStore.create({
        api: pluginApi as PluginApiInterface<AppConfigInterface>,
        googleDriveStore: GoogleDriveStore.create({
          api: pluginApi as PluginApiInterface<AppConfigInterface>
        })
      }),
    [pluginApi]
  );

  useEffect(() => {
    store.init();
  }, [store]);

  return (
    <ThemeProvider theme={theme}>
      <StoreProvider value={store}>
        <GoogleDrivePage />
      </StoreProvider>
    </ThemeProvider>
  );
};

export default GoogleDriveApp;
