import {
  PluginApiInterface,
  ObjectGlobalPropsContextProvider,
  UsePluginHookType
} from '@momentum-xyz/sdk';
import {AppConfigInterface, MiroPluginPropsInterface} from 'core/interfaces';
import {MiroBoardPage} from 'pages';
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

  useEffect(() => {
    if (props.objectId) {
      store.init(props.objectId);
    }
  }, [store, props.objectId]);

  const content = useMemo(
    () => (
      <ObjectGlobalPropsContextProvider props={props}>
        <StoreProvider value={store}>
          <MiroBoardPage />
        </StoreProvider>
      </ObjectGlobalPropsContextProvider>
    ),
    [props, store]
  );

  return {
    content
  };
};
