import React from 'react';
import ReactDOM from 'react-dom';
import 'static/styles/index.css';
import {ThemeProvider} from 'styled-components';
import {DefaultThemeConfig} from '@momentum-xyz/ui-kit';
import {HostEmulator} from '@momentum-xyz/sdk';
import {MomentumRequiredPage} from 'pages/MomentumRequiredPage';

import '@momentum-xyz/ui-kit/dist/themes/themes';
import 'shared/services/i18n';

import plugin from './Plugin';

const isDevEnv = process.env.NODE_ENV === 'development';

const root = document.getElementById('root') as HTMLElement;

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={DefaultThemeConfig}>
      {isDevEnv ? <HostEmulator plugin={plugin} /> : <MomentumRequiredPage />}
    </ThemeProvider>
  </React.StrictMode>,
  root
);
