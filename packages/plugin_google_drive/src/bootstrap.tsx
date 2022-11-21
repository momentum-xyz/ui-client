import React from 'react';
import ReactDOM from 'react-dom';
import 'static/styles/index.css';
import {ThemeProvider} from 'styled-components';
import {DefaultThemeConfig} from '@momentum-xyz/ui-kit';
import {HostEmulator, PluginInterface} from '@momentum-xyz/sdk';

import '@momentum-xyz/ui-kit/dist/themes/themes';
import 'shared/services/i18n';

import plugin from './Plugin';

const root = document.getElementById('root') as HTMLElement;

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={DefaultThemeConfig}>
      <HostEmulator plugin={plugin as PluginInterface} />
    </ThemeProvider>
  </React.StrictMode>,
  root
);
