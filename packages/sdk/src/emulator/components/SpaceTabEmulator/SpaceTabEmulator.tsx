import {FC, useCallback, useMemo, useRef, useState} from 'react';
import {ErrorBoundary, ThemeInterface} from '@momentum-xyz/ui-kit';

import {useTheme} from '../../../contexts/ThemeContext';
import {CorePluginPropsInterface, PluginInterface} from '../../../interfaces';
import {SpaceGlobalPropsContextProvider} from '../../../contexts';

import * as styled from './SpaceTabEmulator.styled';

interface PropsInterface {
  plugin: PluginInterface;
}

export const SpaceTabEmulator: FC<PropsInterface> = ({plugin}) => {
  console.log('RENDER SpaceEmulator', {plugin});
  const theme = useTheme();

  const stateAttribute = useRef<Record<string, any>>({});

  const config = useMemo(
    () => ({
      APP_ID: ''
    }),
    []
  );

  const coreProps: CorePluginPropsInterface = useMemo(
    () => ({
      theme: theme as ThemeInterface,
      isSpaceAdmin: false,
      spaceId: '42424242-4242-4242-4242-424242424242',
      api: {
        get: (field: string) => Promise.resolve(stateAttribute.current[field]),
        set: (field: string, value: unknown) => {
          stateAttribute.current[field] = value;
          return Promise.resolve(stateAttribute.current[field]);
        },
        getConfig: () => Promise.resolve(config)
      }
    }),
    [theme, config]
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
          <SpaceGlobalPropsContextProvider
            props={{
              ...coreProps,
              renderTopBarActions
            }}
          >
            <plugin.SpaceExtension />
          </SpaceGlobalPropsContextProvider>
        </ErrorBoundary>
      )}
    </div>
  );
};
