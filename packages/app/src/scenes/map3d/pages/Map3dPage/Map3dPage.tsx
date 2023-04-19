import {FC, useEffect, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {Universe3dEmitter} from '@momentum-xyz/core';
import {UniverseScene} from '@momentum-xyz/odyssey3d';
import {PositionEnum} from '@momentum-xyz/ui-kit-storybook';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {getImageAbsoluteUrl} from 'core/utils';

const Map3dPage: FC = () => {
  const {widgetManagerStore, universeStore} = useStore();
  const {allWorlds, allUsers} = universeStore.universe2dStore;

  // FIXME: Workaround to prevent sending twice lists
  const usersWereInitialised = useRef<boolean>(false);
  const worldsWereInitialised = useRef<boolean>(false);

  useEffect(() => {
    return () => {
      widgetManagerStore.closeAll();
    };
  }, [widgetManagerStore]);

  useEffect(() => {
    console.log('Map3dPage: useEffect', allWorlds, allUsers);
    if (allWorlds.length > 0 && !usersWereInitialised.current) {
      usersWereInitialised.current = true;
      Universe3dEmitter.emit(
        'WorldsAdded',
        allWorlds.map((world) => ({
          id: `${world.id}_temp`,
          name: world.name,
          description: world.description || '',
          image: getImageAbsoluteUrl(world.avatarHash) || '',
          owner: ''
        }))
      );
    }

    if (allUsers.length > 0 && !worldsWereInitialised.current) {
      worldsWereInitialised.current = true;
      Universe3dEmitter.emit(
        'UsersAdded',
        allUsers.map((user) => ({
          id: user.id,
          name: user.name,
          avatar: getImageAbsoluteUrl(user.profile.avatarHash) || ''
        }))
      );
    }
  }, [allWorlds, allUsers, allUsers.length, allWorlds.length]);

  return (
    <UniverseScene
      events={Universe3dEmitter}
      onWorldClick={(id) => {
        console.log('Map3dPage: Select world: ', id);
        const real_id = id.split('_')[0];
        widgetManagerStore.open(WidgetEnum.WORLD_DETAILS, PositionEnum.LEFT, {id: real_id});
      }}
      onUserClick={(id) => {
        console.log('Map3dPage: Select user: ', id);
        widgetManagerStore.open(WidgetEnum.USER_DETAILS, PositionEnum.LEFT, {id});
      }}
      onClickOutside={() => {
        widgetManagerStore.closeAll(); // ???
      }}
    />
  );
};

export default observer(Map3dPage);
