import {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Universe3dEmitter} from '@momentum-xyz/core';
import {UniverseScene} from '@momentum-xyz/odyssey3d';

import {useStore} from 'shared/hooks';
import {getImageAbsoluteUrl} from 'core/utils';

const Map3dPage: FC = () => {
  const {widgetManagerStore, universeStore} = useStore();
  // const {previewOdysseyStore, odysseyInfoStore} = widgetsStore;
  const {allWorlds, allUsers} = universeStore.universe2dStore;

  useEffect(() => {
    return () => {
      widgetManagerStore.closeAll();
    };
  }, [widgetManagerStore]);

  useEffect(() => {
    console.log('Map3dPage: useEffect', allWorlds, allUsers);
    if (allWorlds.length) {
      Universe3dEmitter.emit(
        'WorldsAdded',
        allWorlds.map((world) => ({
          id: world.id,
          name: world.name,
          description: world.description || '',
          image: getImageAbsoluteUrl(world.avatarHash) || '',
          owner: ''
        }))
      );
    }

    if (allUsers.length) {
      Universe3dEmitter.emit(
        'UsersAdded',
        allUsers.map((user) => ({
          ...user,
          id: user.id,
          avatar: getImageAbsoluteUrl(user.profile.avatarHash) || ''
        }))
      );
    }
  }, [allWorlds, allUsers, allUsers.length, allWorlds.length]);

  const handleSelectWorld = useCallback((uuid: string) => {
    console.log('Map3dPage: handleSelectWorld', uuid);
    // widgetManagerStore.open(WidgetEnum.WORLD_OVERVIEW, PositionEnum.LEFT, {id: uuid});
  }, []);

  const handleSelectUser = useCallback((uuid: string) => {
    console.log('Map3dPage: handleSelectUser', uuid);
    // widgetManagerStore.open(WidgetEnum.WORLD_OVERVIEW, PositionEnum.LEFT, {id: uuid});
  }, []);

  const handleClickOutside = useCallback(() => {
    widgetManagerStore.closeAll();
  }, [widgetManagerStore]);

  return (
    <UniverseScene
      events={Universe3dEmitter}
      onWorldClick={handleSelectWorld}
      onUserClick={handleSelectUser}
      onClickOutside={handleClickOutside}
    />
  );
};

export default observer(Map3dPage);
