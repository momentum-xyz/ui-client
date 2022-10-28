import {FC, useState} from 'react';
import {PluginInterface} from 'interfaces';

import * as styled from './HostEmulator.styled';
import {SpaceTabEmulator} from './components/';

interface PropsInterface {
  plugin: PluginInterface;
}

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
