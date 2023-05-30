import {FC} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {ThemeProvider} from 'styled-components';
import {DefaultThemeConfig} from '@momentum-xyz/ui-kit';

import {PluginInterface} from '../interfaces';

import {MomentumRequiredPage, WorldEmulator} from './components/';
import * as styled from './HostEmulator.styled';

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

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(<HostEmulator plugin={plugin as PluginInterface} />);
```
 */
export const HostEmulator: FC<PropsInterface> = ({plugin}) => {
  console.log('RENDER HostEmulator', {plugin});
  return (
    <ThemeProvider theme={DefaultThemeConfig}>
      <styled.FullScreenContainer>
        {isDevEnv ? (
          <BrowserRouter>
            <WorldEmulator plugin={plugin} />
          </BrowserRouter>
        ) : (
          <MomentumRequiredPage />
        )}
      </styled.FullScreenContainer>
    </ThemeProvider>
  );
};
