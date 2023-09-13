import {FC, useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Universe3dEmitter} from '@momentum-xyz/core';
import {UniverseBabylonScene} from '@momentum-xyz/core3d';
import {PositionEnum} from '@momentum-xyz/ui-kit';

import {appVariables} from 'api/constants';
import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {getImageAbsoluteUrl} from 'core/utils';

const Universe3dPage: FC = () => {
  const {widgetManagerStore, universeStore} = useStore();
  const {allSortedWorlds, allUsers} = universeStore.universe2dStore;

  const [readyToHandleEvents, setReadyToHandleEvents] = useState<boolean>(false);

  // FIXME: Workaround to prevent sending twice lists
  const usersWereInitialised = useRef<boolean>(false);
  const worldsWereInitialised = useRef<boolean>(false);

  useEffect(() => {
    widgetManagerStore.open(WidgetEnum.EXPLORE, PositionEnum.LEFT);

    return () => {
      widgetManagerStore.closeAll();
    };
  }, [widgetManagerStore]);

  useEffect(() => {
    console.log(
      'Universe3dPage: useEffect',
      allSortedWorlds,
      allUsers,
      usersWereInitialised.current,
      worldsWereInitialised.current,
      readyToHandleEvents
    );
    if (!readyToHandleEvents) {
      return;
    }

    if (allSortedWorlds.length > 0 && !usersWereInitialised.current) {
      usersWereInitialised.current = true;
      Universe3dEmitter.emit(
        'WorldsAdded',
        allSortedWorlds.map((world) => ({
          id: `${world.id}_temp`,
          name: world.name,
          description: world.description || '',
          image: world.avatarHash || '',
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
  }, [allUsers.length, allSortedWorlds.length, readyToHandleEvents, allSortedWorlds, allUsers]);

  return (
    <UniverseBabylonScene
      events={Universe3dEmitter}
      renderURL={appVariables.RENDER_SERVICE_URL}
      onWorldClick={(id) => {
        console.log('Universe3dPage: Select world: ', id);
        const real_id = id.split('_')[0];
        widgetManagerStore.open(WidgetEnum.WORLD_DETAILS, PositionEnum.LEFT, {id: real_id});
      }}
      onUserClick={(id) => {
        console.log('Universe3dPage: Select user: ', id);
        widgetManagerStore.open(WidgetEnum.USER_DETAILS, PositionEnum.LEFT, {id});
      }}
      onClickOutside={() => {
        //widgetManagerStore.closeAll();
      }}
      onReadyToHandleEvents={() => {
        console.log('Universe3dPage: onReadyToHandleEvents');
        setReadyToHandleEvents(true);
      }}
    />
  );
};

export default observer(Universe3dPage);
