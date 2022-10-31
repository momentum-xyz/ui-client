import {FC, useState} from 'react';
import {PluginInterface} from 'interfaces';

import * as styled from './HostEmulator.styled';
import {SpaceTabEmulator} from './components/';

interface PropsInterface {
  plugin: PluginInterface;
}

/**
 * Emulates the host environment for your plugin for local development.
 * 
 * Example of usage:
```tsx
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
```
 */
export const HostEmulator: FC<PropsInterface> = ({plugin}) => {
  console.log('RENDER HostEmulator', {plugin});
  const [tab, setTab] = useState('dash');
  return (
    <styled.FullScreenContainer>
      <styled.SpaceLayout>
        <styled.SpaceNav>
          <styled.SpaceTab onClick={() => setTab('dash')}>Dashboard</styled.SpaceTab>
          <styled.SpaceTab onClick={() => setTab('plugin')}>Plugin</styled.SpaceTab>
        </styled.SpaceNav>
        <styled.SpaceContent>
          {tab === 'dash' && <div>Dashboard Content</div>}
          {tab === 'plugin' && <SpaceTabEmulator plugin={plugin} />}
        </styled.SpaceContent>
      </styled.SpaceLayout>
    </styled.FullScreenContainer>
  );
};
