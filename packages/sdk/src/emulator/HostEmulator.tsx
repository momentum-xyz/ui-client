import {FC} from 'react';
import {PluginInterface} from 'interfaces';

import * as styled from './HostEmulator.styled';
import {MomentumRequiredPage, WorldEmulator} from './components/';

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
    <ThemeProvider theme={DefaultThemeConfig}>
      <HostEmulator plugin={plugin} />
    </ThemeProvider>
  </React.StrictMode>,
  root
);
```
 */
export const HostEmulator: FC<PropsInterface> = ({plugin}) => {
  console.log('RENDER HostEmulator', {plugin});
  return (
    <styled.FullScreenContainer>
      {isDevEnv ? <WorldEmulator plugin={plugin} /> : <MomentumRequiredPage />}
    </styled.FullScreenContainer>
  );
};
