import {
  PluginApiInterface,
  SpaceGlobalPropsContextProvider,
  UsePluginHookType
} from '@momentum-xyz/sdk';
import {AppConfigInterface, MiroPluginPropsInterface} from 'core/interfaces';
import {MiroBoardPage} from 'pages';
import {MiroActions} from 'pages/MiroBoardPage/components';
import {useEffect, useMemo} from 'react';
import {StoreProvider} from 'shared/hooks/useStore';
import {RootMiroStore} from 'stores';

export const usePlugin: UsePluginHookType<MiroPluginPropsInterface> = (props) => {
  const store = useMemo(
    () =>
      RootMiroStore.create({
        attributesApi: props.api,
        api: props.pluginApi as PluginApiInterface<AppConfigInterface>
      }),
    [props.api, props.pluginApi]
  );

  const {miroBoardStore} = store;
  const {board, pickBoard, disableBoard} = miroBoardStore;

  useEffect(() => {
    if (props.spaceId) {
      store.init(props.spaceId);
    }
  }, [store, props.spaceId]);

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
