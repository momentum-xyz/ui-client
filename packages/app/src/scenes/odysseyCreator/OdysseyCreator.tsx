import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {UnityService} from 'shared/services';
import {createSwitchByConfig} from 'core/utils';

import {ODYSSEY_CREATOR_ROUTES} from './OdysseyCreator.routes';
import {CreatorMenu} from './components';

const OdysseyCreator: FC = () => {
  const {unityStore} = useStore();
  const {worldId} = unityStore;

  const history = useHistory();

  useEffect(() => {
    UnityService.toggleBuildMode();
    return () => {
      UnityService.toggleBuildMode();
    };
  }, []);

  return (
    <>
      <CreatorMenu
        onAddObject={() => {
          history.push(generatePath(ROUTES.odyssey.creator.spawnAsset.base, {worldId}));
        }}
        onSkyboxClick={() => {
          history.push(generatePath(ROUTES.odyssey.creator.skybox, {worldId}));
        }}
      />
      {createSwitchByConfig(ODYSSEY_CREATOR_ROUTES, ROUTES.odyssey.creator.base)}
    </>
  );
};

export default observer(OdysseyCreator);
