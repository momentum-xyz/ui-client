import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Universe3dEmitter} from '@momentum-xyz/core';
import {Map3dCanvas} from '@momentum-xyz/map3d';
import {PositionEnum} from '@momentum-xyz/ui-kit-storybook';
import {UniverseScene} from '@momentum-xyz/odyssey3d';

import {useStore} from 'shared/hooks';
import {getImageAbsoluteUrl} from 'core/utils';
import {WidgetEnum} from 'core/enums';

interface PropsInterface {
  isClickActive?: boolean;
}

// TEMP
const isBabylonUniverse = window.sessionStorage.getItem('babylon_universe');

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
          ...world,
          id: world.uuid,
          description: world.description || ''
        }))
      );
    }

    if (allUsers.length) {
      Universe3dEmitter.emit(
        'UsersAdded',
        allUsers.map((user) => ({
          ...user,
          id: user.uuid + '__temp123',
          avatar: getImageAbsoluteUrl(user.image) || ''
        }))
      );
    }
  }, [allWorlds, allUsers]);

  useEffect(() => {
    console.log('Map3dPage: useEffect', nftStore.nftItems);
  }, [nftStore.nftItems]);

  const handleSelect = useCallback(
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

  if (nftStore.isLoading || !sessionStore.map3dUser) {
    return <></>;
  }

  return isBabylonUniverse ? (
    <UniverseScene
      events={Universe3dEmitter}
      onWorldClick={handleSelect}
      onUserClick={handleSelectUser}
      onClickOutside={handleClickOutside}
    />
  ) : (
    <Map3dCanvas
      currentUser={sessionStore.map3dUser}
      selectedUuid={odysseyInfoStore.nftId}
      items={nftStore.nftItems}
      getConnections={nftStore.getStakedAtOthersByWallet}
      getImageUrl={getImageAbsoluteUrl}
      onSelect={handleSelect}
    />
  );
};

export default observer(Map3dPage);
