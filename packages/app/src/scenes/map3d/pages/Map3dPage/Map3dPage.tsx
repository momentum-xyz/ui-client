import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Universe3dEmitter} from '@momentum-xyz/core';
import {PositionEnum} from '@momentum-xyz/ui-kit-storybook';
import {UniverseScene} from '@momentum-xyz/odyssey3d';

import {useStore} from 'shared/hooks';
import {getImageAbsoluteUrl} from 'core/utils';
import {WidgetEnum} from 'core/enums';

interface PropsInterface {
  isClickActive?: boolean;
}

const Map3dPage: FC<PropsInterface> = () => {
  const {nftStore, widgetsStore, sessionStore, widgetManagerStore, universeStore} = useStore();
  const {previewOdysseyStore, odysseyInfoStore} = widgetsStore;
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

  const handleSelectWorld = useCallback(
    (uuid: string) => {
      if (sessionStore.isGuest) {
        const nft = nftStore.getNftByUuid(uuid);
        previewOdysseyStore.open(nft!);
      }

      if (!sessionStore.isGuest) {
        widgetManagerStore.open(WidgetEnum.WORLD_OVERVIEW, PositionEnum.LEFT, {id: uuid});
        odysseyInfoStore.open(uuid);
      }
    },
    [nftStore, odysseyInfoStore, previewOdysseyStore, sessionStore.isGuest, widgetManagerStore]
  );

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
