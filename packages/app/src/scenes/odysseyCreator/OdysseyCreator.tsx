import {observer} from 'mobx-react-lite';
import {FC, useEffect} from 'react';

import {createSwitchByConfig} from 'core/utils';
import {ROUTES} from 'core/constants';
import {UnityService} from 'shared/services';

import {ODYSSEY_CREATOR_ROUTES} from './OdysseyCreator.routes';

const OdysseyCreator: FC = () => {
  useEffect(() => {
    const isOn = UnityService.isBuildMode;
    if (!isOn) {
      UnityService.toggleBuildMode();
    }
    return () => {
      if (isOn) {
        UnityService.toggleBuildMode();
      }
    };
  }, []);

  return <>{createSwitchByConfig(ODYSSEY_CREATOR_ROUTES, ROUTES.odyssey.creator.base)}</>;
};

export default observer(OdysseyCreator);
