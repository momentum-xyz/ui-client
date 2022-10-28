import {FC, useCallback, useMemo, useRef, useState} from 'react';
import {CorePluginPropsInterface, PluginInterface} from 'interfaces';
import {useTheme} from 'styled-components';
import {ErrorBoundary, ThemeInterface} from '@momentum-xyz/ui-kit';

import * as styled from './HostEmulator.styled';

interface PropsInterface {
  plugin: PluginInterface;
}

const SpaceTabEmulator: FC<PropsInterface> = ({plugin}) => {
  console.log('RENDER SpaceEmulator', {plugin});
  const theme = useTheme();

  const stateAttribute = useRef<Record<string, any>>({});

  const coreProps: CorePluginPropsInterface = useMemo(
    () => ({
      theme: theme as ThemeInterface,
      isSpaceAdmin: false,
      spaceId: '123',
      api: {
        get: (field: string) => Promise.resolve(stateAttribute.current[field]),
        set: (field: string, value: unknown) => {
          stateAttribute.current[field] = value;
          return Promise.resolve();
        }
      }
    }),
    [theme]
  );

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
