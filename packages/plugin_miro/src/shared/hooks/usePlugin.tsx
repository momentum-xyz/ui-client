import {PluginApiInterface, UsePluginHookType} from '@momentum-xyz/sdk';
import {AppConfigInterface} from 'core/interfaces';
import {MiroBoardPage} from 'pages';
import {useEffect, useMemo} from 'react';
import {StoreProvider} from 'shared/hooks/useStore';
import {RootMiroStore} from 'stores';

export const usePlugin: UsePluginHookType<AppConfigInterface> = (props) => {
  const store = useMemo(
    () =>
      RootMiroStore.create({
        api: props.pluginApi as PluginApiInterface<AppConfigInterface>
      }),
    [props.pluginApi]
  );

  useEffect(() => {
    if (props.objectId) {
      store.init(props.objectId);
    }
  }, [store, props.objectId]);

  const content = (
    <StoreProvider value={store}>
      <MiroBoardPage />
    </StoreProvider>
  );

  return {
    content
  };
};
