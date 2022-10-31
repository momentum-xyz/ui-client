import {FC, useCallback, useMemo, useRef} from 'react';
import {CorePluginPropsInterface, PluginInterface} from 'interfaces';
import {useTheme} from 'styled-components';
import {ErrorBoundary, ThemeInterface} from '@momentum-xyz/ui-kit';

interface PropsInterface {
  plugin: PluginInterface;
  setTopBar: (topBar: JSX.Element) => void;
}

export const SpaceTabEmulator: FC<PropsInterface> = ({plugin, setTopBar}) => {
  console.log('RENDER SpaceTabEmulator', {plugin});
  const theme = useTheme();

  const stateAttribute = useRef<Record<string, any>>({});

  const coreProps: CorePluginPropsInterface = useMemo(
    () => ({
      theme: theme as ThemeInterface,
      isSpaceAdmin: false,
      spaceId: '42424242-4242-4242-4242-424242424242',
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

  const renderTopBarActions = useCallback(
    ({main}) => {
      setTopBar(main());
    },
    [setTopBar]
  );

  return (
    <>
      {!!plugin.SpaceExtension && (
        <ErrorBoundary errorMessage="Error while rendering plugin">
          <plugin.SpaceExtension renderTopBarActions={renderTopBarActions} {...coreProps} />
        </ErrorBoundary>
      )}
    </>
  );
};
