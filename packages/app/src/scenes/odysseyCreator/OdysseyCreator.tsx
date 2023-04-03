import {observer} from 'mobx-react-lite';
import {FC, useEffect} from 'react';
import {generatePath} from 'react-router-dom';

import {createSwitchByConfig} from 'core/utils';
import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import {ODYSSEY_CREATOR_ROUTES} from './OdysseyCreator.routes';
import {CreatorMenu, ObjectMenu} from './components';

const OdysseyCreator: FC = () => {
  const {universeStore} = useStore();
  const {world3dStore} = universeStore;
  const {worldId} = universeStore;

  useEffect(() => {
    world3dStore?.enableCreatorMode();
    return () => {
      world3dStore?.disableCreatorMode();
    };
  }, []);

  return (
    <>
      <CreatorMenu />
      {createSwitchByConfig(
        ODYSSEY_CREATOR_ROUTES,
        generatePath(ROUTES.odyssey.base, {worldId}),
        () => {
          return universeStore.isCurrentUserWorldAdmin;
        }
      )}
      {world3dStore?.objectMenu.isOpen && <ObjectMenu />}
    </>
  );
};

export default observer(OdysseyCreator);
