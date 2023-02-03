import React, {FC} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {ThemeProvider} from 'styled-components';
import {DefaultThemeConfig} from '@momentum-xyz/ui-kit';

import {PluginInterface} from '../interfaces';
import {GlobalStyles} from '../App.styled';
import {UnityControlContextProvider} from '../contexts';

import * as styled from './HostEmulator.styled';
import {MomentumRequiredPage, WorldEmulator} from './components/';
import {dummyUnityControl} from './dummyUnityControl';

const isDevEnv = process.env.NODE_ENV === 'development';

interface PropsInterface {
  plugin: PluginInterface;
}

/**
 * Emulates the host environment for your plugin for local development.
 * Show Momentum required page if not in dev environment.
 * 
 * Example of usage:
```tsx
import plugin from './Plugin';

const root = document.getElementById('root') as HTMLElement;

ReactDOM.render(
  <React.StrictMode>
    <HostEmulator plugin={plugin} />
  </React.StrictMode>,
  root
);
```
 */
export const HostEmulator: FC<PropsInterface> = ({plugin}) => {
  console.log('RENDER HostEmulator', {plugin});
  return (
    <ThemeProvider theme={DefaultThemeConfig}>
      <styled.FullScreenContainer>
        <UnityControlContextProvider value={dummyUnityControl}>
          <GlobalStyles />
          {isDevEnv ? (
            <BrowserRouter>
              <WorldEmulator plugin={plugin} />
            </BrowserRouter>
          ) : (
            <MomentumRequiredPage />
          )}
        </UnityControlContextProvider>
      </styled.FullScreenContainer>
    </ThemeProvider>
  );
};
