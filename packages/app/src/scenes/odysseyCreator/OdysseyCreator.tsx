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
  const {instance3DStore} = universeStore;
  const {worldId} = universeStore;

  useEffect(() => {
    instance3DStore.enableCreatorMode();
    return () => {
      instance3DStore.disableCreatorMode();
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
      {instance3DStore.objectMenu.isOpen && <ObjectMenu />}
    </>
  );
};

export default observer(OdysseyCreator);
