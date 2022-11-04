import React, {FC, useEffect, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {ThemeProvider} from 'styled-components';
import {MiroPluginPropsInterface} from 'core/interfaces';
import {SpaceGlobalPropsContextProvider} from '@momentum-xyz/sdk';
import {MiroBoardPage} from 'pages';
import {RootMiroStore} from 'stores';
import {StoreProvider} from 'shared/hooks/useStore';

import '@momentum-xyz/ui-kit/dist/themes/themes';

import 'shared/services/i18n';
import 'core/utils/boardsPicker.1.0.js';

const MiroApp: FC<MiroPluginPropsInterface> = (props) => {
  const {theme} = props;

  const store = useMemo(() => RootMiroStore.create({api: props.api}), [props.api]);

  useEffect(() => {
    store.init();
  }, [store]);

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

export default observer(MiroApp);
