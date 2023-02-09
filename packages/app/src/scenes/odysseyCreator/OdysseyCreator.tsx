import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {UnityService} from 'shared/services';
import {createSwitchByConfig} from 'core/utils';

import {ODYSSEY_CREATOR_ROUTES} from './OdysseyCreator.routes';
import {CreatorMenu, ObjectMenu} from './components';

const OdysseyCreator: FC = () => {
  const {unityStore} = useStore();
  const {unityInstanceStore} = unityStore;
  const {worldId} = unityStore;

  useEffect(() => {
    UnityService.toggleBuildMode();

    return () => {
      UnityService.toggleBuildMode();
    };
  }, []);

  return (
    <>
      <CreatorMenu />
      {createSwitchByConfig(
        ODYSSEY_CREATOR_ROUTES,
        generatePath(ROUTES.odyssey.base, {worldId}),
        () => {
          return unityStore.isCurrentUserWorldAdmin;
        }
      )}
      {unityInstanceStore.objectMenu.isOpen && <ObjectMenu />}
    </>
  );
};

export default observer(OdysseyCreator);
