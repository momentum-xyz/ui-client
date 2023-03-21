import React from 'react';
import {createRoot} from 'react-dom/client';
import 'static/styles/index.css';
import {ThemeProvider as ThemeProviderOriginal, ThemeProviderProps} from 'styled-components';
import {DefaultThemeConfig} from '@momentum-xyz/ui-kit';
import {HostEmulator, PluginInterface} from '@momentum-xyz/sdk';

import '@momentum-xyz/ui-kit/dist/themes/themes';

import plugin from './Plugin';

const ThemeProvider = ThemeProviderOriginal as unknown as React.FC<ThemeProviderProps<any>>;

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={DefaultThemeConfig}>
      <HostEmulator plugin={plugin as PluginInterface} />
    </ThemeProvider>
  </React.StrictMode>
);
