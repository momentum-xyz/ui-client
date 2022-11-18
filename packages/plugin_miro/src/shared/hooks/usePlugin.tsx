import {
  PluginApiInterface,
  SpaceGlobalPropsContextProvider,
  UsePluginHookType
} from '@momentum-xyz/sdk';
import {AppConfigInterface} from 'core/interfaces';
import {useObserver} from 'mobx-react-lite';
import {MiroBoardPage} from 'pages';
import {MiroActions} from 'pages/MiroBoardPage/components';
import {useMemo} from 'react';
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

  const topBar = useObserver(() => (
    <MiroActions
      isAdmin={props.isSpaceAdmin}
      board={board}
      pick={pickBoard}
      disable={disableBoard}
    />
  ));

  return {
    content,
    topBar
  };
};

export default usePlugin;
