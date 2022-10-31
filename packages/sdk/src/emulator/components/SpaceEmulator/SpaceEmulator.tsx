import {FC, useState} from 'react';

import {PluginInterface} from '../../../interfaces';
import {SpaceTabEmulator} from '../SpaceTabEmulator';

import * as styled from './SpaceEmulator.styled';

interface PropsInterface {
  plugin: PluginInterface;
  onClose: () => void;
}

export const SpaceEmulator: FC<PropsInterface> = ({plugin, onClose}) => {
  console.log('RENDER SpaceEmulator', {plugin});
  const [tab, setTab] = useState('dash');

  const [topBar = <span />, setTopBar] = useState<JSX.Element | null>(null);

  return (
    <styled.SpaceLayout>
      <styled.SpaceNav>
        <styled.SpaceTab
          onClick={() => {
            setTab('dash');
            setTopBar(null);
          }}
        >
          Dashboard
        </styled.SpaceTab>
        <styled.SpaceTab onClick={() => setTab('plugin')}>Plugin</styled.SpaceTab>
      </styled.SpaceNav>
      <styled.SpaceTabContainer>
        <styled.SpaceTopBar>
          <strong>Space / Plugin</strong>
          {topBar}
          <button onClick={() => onClose()}>X</button>
        </styled.SpaceTopBar>
        <styled.SpaceContent>
          {tab === 'dash' && <div>Dashboard Content</div>}
          {tab === 'plugin' && <SpaceTabEmulator plugin={plugin} setTopBar={setTopBar} />}
        </styled.SpaceContent>
      </styled.SpaceTabContainer>
    </styled.SpaceLayout>
  );
};
