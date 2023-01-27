import {generatePath} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {FC, useEffect} from 'react';

import {createSwitchByConfig} from 'core/utils';
import {ROUTES} from 'core/constants';
import {UnityService} from 'shared/services';
import {useStore} from 'shared/hooks';

import {ODYSSEY_CREATOR_ROUTES} from './OdysseyCreator.routes';

const OdysseyCreator: FC = () => {
  const {unityStore} = useStore();
  const {worldId} = unityStore;
  useEffect(() => {
    UnityService.toggleBuildMode();
    return () => {
      UnityService.toggleBuildMode();
    };
  }, []);

  return (
    <>
      {createSwitchByConfig(
        ODYSSEY_CREATOR_ROUTES,
        generatePath(ROUTES.odyssey.creator.base, {worldId})
      )}
    </>
  );
};

export default observer(OdysseyCreator);
