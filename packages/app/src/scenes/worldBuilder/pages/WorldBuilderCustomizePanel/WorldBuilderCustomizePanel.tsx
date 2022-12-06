import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {createSwitchByConfig} from 'core/utils';

import {WORLD_BUILDER_ROUTES} from './WorldBuilderCustomizePanel.routes';

const WorldBuilderCustomizePanel: FC = () => {
  const {mainStore} = useStore();
  const {unityStore} = mainStore;

  useEffect(() => {
    unityStore.toggleBuildMode();
    return () => {
      unityStore.toggleBuildMode();
    };
  }, [unityStore]);

  return <>{createSwitchByConfig(WORLD_BUILDER_ROUTES, WORLD_BUILDER_ROUTES[0].path)}</>;
};

export default observer(WorldBuilderCustomizePanel);
