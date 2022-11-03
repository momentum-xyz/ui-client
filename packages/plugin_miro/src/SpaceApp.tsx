import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {ThemeProvider} from 'styled-components';
import {appVariables} from 'api/constants';
import {AppConfigInterface, MiroPluginPropsInterface} from 'api/interfaces';
import {SpaceGlobalPropsContextProvider} from '@momentum-xyz/sdk';
import {MiroBoardPage} from 'pages';

import '@momentum-xyz/ui-kit/dist/themes/themes';

import 'shared/services/i18n';
import 'core/utils/boardsPicker.1.0.js';

const SpaceApp: FC<MiroPluginPropsInterface> = (props) => {
  const {theme} = props;

  useEffect(() => {
    props.api.getConfig().then((config) => {
      Object.entries(config).forEach((entry) => {
        const [key, value] = entry;
        appVariables[key as keyof AppConfigInterface] = value as string;
      });
    });
  }, [props.api]);

  return (
    <SpaceGlobalPropsContextProvider props={props}>
      <ThemeProvider theme={theme}>
        <MiroBoardPage />
      </ThemeProvider>
    </SpaceGlobalPropsContextProvider>
  );
};

export default observer(SpaceApp);
