import {FC, useCallback, useState} from 'react';
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
  const coreProps: CorePluginPropsInterface = {
    theme: theme as ThemeInterface,
    isSpaceAdmin: false,
    spaceId: '123'
  };

  const [topBar, setTopBar] = useState(<span />);

  const renderTopBarActions = useCallback(
    ({main}) => {
      setTopBar(main());
    },
    [setTopBar]
  );

  const init = useCallback(async (fields: string[]) => {
    // noop
  }, []);
  const [state, setState] = useState<any>({});
  const setStateField = useCallback(async (field: string, subField: string, subFieldValue: any) => {
    setState((state: any) => ({
      ...state,
      [field]: {
        ...(state[field] || {}),
        [subField]: subFieldValue
      }
    }));
  }, []);

  return (
    <div>
      <styled.SpaceTopBar>
        <strong>Space / Plugin</strong>
        {topBar}
      </styled.SpaceTopBar>
      {!!plugin.SpaceExtension && (
        <ErrorBoundary errorMessage="Error while rendering plugin">
          <plugin.SpaceExtension
            init={init}
            spacePluginState={state}
            setPluginSpaceStateSubField={setStateField}
            renderTopBarActions={renderTopBarActions}
            {...coreProps}
          />
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
