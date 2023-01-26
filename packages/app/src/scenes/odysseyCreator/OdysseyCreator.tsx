import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {UnityService} from 'shared/services';
import {createSwitchByConfig} from 'core/utils';

import {ODYSSEY_CREATOR_ROUTES} from './OdysseyCreator.routes';
import {CreatorMenu, ObjectColorPicker, ObjectMenu} from './components';

const OdysseyCreator: FC = () => {
  const {unityStore} = useStore();
  const {unityInstanceStore} = unityStore;

  useEffect(() => {
    UnityService.toggleBuildMode();

    return () => {
      UnityService.toggleBuildMode();
    };
  }, []);

  return (
    <>
      <CreatorMenu />
      {createSwitchByConfig(ODYSSEY_CREATOR_ROUTES, ROUTES.odyssey.creator.base)}
      {unityInstanceStore.objectMenu.isOpen && <ObjectMenu />}
      {/* FIXME: Render only for base assets */}
      {unityInstanceStore.objectMenu.isOpen && <ObjectColorPicker />}
    </>
  );
};

export default observer(OdysseyCreator);
