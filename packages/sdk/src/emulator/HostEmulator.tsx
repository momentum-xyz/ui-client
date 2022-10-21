import {FC, useCallback, useState} from 'react';
import {CorePluginPropsInterface, PluginInterface} from 'interfaces';
import {useTheme} from 'styled-components';
import {ErrorBoundary, ThemeInterface} from '@momentum-xyz/ui-kit';
import axios, {AxiosInstance} from 'axios';

import * as styled from './HostEmulator.styled';

const REQUEST_TIMEOUT_MS = 10_000;
const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json'
};
const request: AxiosInstance = axios.create({
  baseURL: '',
  responseType: 'json',
  headers: defaultHeaders,
  timeout: REQUEST_TIMEOUT_MS
});

interface PropsInterface {
  plugin: PluginInterface;
}

const SpaceTabEmulator: FC<PropsInterface> = ({plugin}) => {
  console.log('RENDER SpaceEmulator', {plugin});
  const theme = useTheme();
  const coreProps: CorePluginPropsInterface = {
    theme: theme as ThemeInterface,
    isSpaceAdmin: false,
    spaceId: '123',
    request
  };

  const [topBar, setTopBar] = useState(<span />);

  const renderTopBarActions = useCallback(
    ({main}) => {
      setTopBar(main());
    },
    [setTopBar]
  );

  return (
    <div>
      <styled.SpaceTopBar>
        <strong>Space / Plugin</strong>
        {topBar}
      </styled.SpaceTopBar>
      {!!plugin.SpaceExtension && (
        <ErrorBoundary errorMessage="Error while rendering plugin">
          <plugin.SpaceExtension renderTopBarActions={renderTopBarActions} {...coreProps} />
        </ErrorBoundary>
      )}
    </div>
  );
};

export const HostEmulator: FC<PropsInterface> = ({plugin}) => {
  console.log('RENDER HostEmulator', {plugin});
  const [tab, setTab] = useState('dash');
  return (
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
  );
};
