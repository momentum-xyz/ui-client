import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {SpacePluginPropsInterface} from '@momentum-xyz/sdk';
import {ThemeProvider} from 'styled-components';
import {RootStore} from 'stores';
import {appVariables} from 'api/constants';
import {AppConfigExtendedInterface, AppConfigInterface} from 'api/interfaces';
import {StoreProvider} from 'shared/hooks';
import {SpaceGlobalPropsContextProvider} from '@momentum-xyz/sdk';
import {MiroBoardPage} from 'pages';

import '@momentum-xyz/ui-kit/dist/themes/themes';

import 'shared/services/i18n';
import 'core/utils/boardsPicker.1.0.js';

const SpaceApp: FC<SpacePluginPropsInterface> = (props) => {
  const {theme} = props;
  const store = RootStore.create({});

  useEffect(() => {
    // @ts-ignore: window['env']
    const env: AppConfigExtendedInterface | undefined = window['env'];

    if (env) {
      Object.entries(env).forEach((entry) => {
        const [key, value] = entry;
        appVariables[key as keyof AppConfigInterface] = value as string;
      });
    }
  }, []);

  return (
    <SpaceGlobalPropsContextProvider props={props}>
      <StoreProvider value={store}>
        <ThemeProvider theme={theme}>
          <MiroBoardPage />
        </ThemeProvider>
      </StoreProvider>
    </SpaceGlobalPropsContextProvider>
  );
};

export default observer(SpaceApp);
