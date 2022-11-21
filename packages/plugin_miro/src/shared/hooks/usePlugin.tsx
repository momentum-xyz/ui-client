import {
  PluginApiInterface,
  SpaceGlobalPropsContextProvider,
  UsePluginHookType
} from '@momentum-xyz/sdk';
import {AppConfigInterface} from 'core/interfaces';
import {MiroBoardPage} from 'pages';
import {MiroActions} from 'pages/MiroBoardPage/components';
import {useEffect, useMemo} from 'react';
import {StoreProvider} from 'shared/hooks/useStore';
import {RootMiroStore} from 'stores';

const usePlugin: UsePluginHookType<AppConfigInterface> = (props) => {
  const store = useMemo(
    () =>
      RootMiroStore.create({
        api: props.pluginApi as PluginApiInterface<AppConfigInterface>
      }),
    [props.pluginApi]
  );

  const {miroBoardStore} = store;
  const {board, pickBoard, disableBoard} = miroBoardStore;

  useEffect(() => {
    store.init();
  }, [store]);

  const content = useMemo(
    () => (
      <SpaceGlobalPropsContextProvider props={props}>
        <StoreProvider value={store}>
          <MiroBoardPage />
        </StoreProvider>
      </SpaceGlobalPropsContextProvider>
    ),
    [props, store]
  );

  const topBar = useMemo(
    () => (
      <MiroActions
        spaceId={props.spaceId}
        isAdmin={props.isSpaceAdmin}
        board={board}
        pick={pickBoard}
        disable={disableBoard}
      />
    ),
    [board, disableBoard, pickBoard, props.isSpaceAdmin, props.spaceId]
  );

  const subtitle = useMemo(() => {
    return board?.name;
  }, [board?.name]);

  return {
    content,
    topBar,
    subtitle
  };
};

export default usePlugin;
