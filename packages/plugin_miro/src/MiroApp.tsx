import React, {FC, useEffect, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {ThemeProvider} from 'styled-components';
import {AppConfigInterface} from 'core/interfaces';
import {MiroBoardPage} from 'pages';
import {RootMiroStore} from 'stores';
import {StoreProvider} from 'shared/hooks/useStore';
import {useSpace, useTheme, PluginApiInterface} from '@momentum-xyz/sdk';

import '@momentum-xyz/ui-kit/dist/themes/themes';

import 'shared/services/i18n';
import 'core/utils/boardsPicker.1.0.js';

const MiroApp: FC = () => {
  const theme = useTheme();
  const {pluginApi} = useSpace();

  const store = useMemo(
    () =>
      RootMiroStore.create({
        api: pluginApi as PluginApiInterface<AppConfigInterface>
      }),
    [pluginApi]
  );

  useEffect(() => {
    store.init();
  }, [store]);

  return (
    <StoreProvider value={store}>
      <ThemeProvider theme={theme}>
        <MiroBoardPage />
      </ThemeProvider>
    </StoreProvider>
  );
};

export default observer(MiroApp);
