import {FC} from 'react';
import {BrowserRouter} from 'react-router-dom';

import {PluginConfigInterface, UsePluginHookType} from '../interfaces';

import * as styled from './HostEmulator.styled';
import {MomentumRequiredPage, WorldEmulator} from './components/';

const isDevEnv = process.env.NODE_ENV === 'development';

interface PropsInterface {
  usePlugin: UsePluginHookType<PluginConfigInterface>;
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
    <ThemeProvider theme={DefaultThemeConfig}>
      <HostEmulator plugin={plugin} />
    </ThemeProvider>
  </React.StrictMode>,
  root
);
```
 */
export const HostEmulator: FC<PropsInterface> = ({usePlugin}) => {
  console.log('RENDER HostEmulator', {usePlugin});
  return (
    <styled.FullScreenContainer>
      {isDevEnv ? (
        <BrowserRouter>
          <WorldEmulator usePlugin={usePlugin} />
        </BrowserRouter>
      ) : (
        <MomentumRequiredPage />
      )}
    </styled.FullScreenContainer>
  );
};
