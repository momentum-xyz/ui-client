import {observer} from 'mobx-react-lite';
import React, {FC, useEffect} from 'react';
import {PanelLayout, Portal, SearchInput} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {OdysseyInfo} from 'ui-kit/molecules/OdysseyInfo';
import {useNavigation, useStore} from 'shared/hooks';

import * as styled from './SearchUsersWidget.styled';
import {OnlineUser} from './components';

const DIALOG_WIDTH_PX = 296;

const SearchUsersWidget: FC = () => {
  const {widgetsStore, nftStore, sessionStore, universeStore} = useStore();
  const {world3dStore} = universeStore;
  const {onlineUsersStore} = widgetsStore;

  const isAlreadyConnected = nftStore.isAlreadyConnected(onlineUsersStore.odyssey?.owner || '');

  const {t} = useI18n();
  const {goToOdysseyHome} = useNavigation();

  useEffect(() => {
    world3dStore?.changeKeyboardControl(false);

    return () => {
      world3dStore?.changeKeyboardControl(true);
    };
  }, [world3dStore]);

  const handleClose = () => {
    onlineUsersStore.dialog.close();
    onlineUsersStore?.unselectUser();
    onlineUsersStore.searchUsers('');
  };

  const handleOdysseyTeleport = (id?: string) => {
    goToOdysseyHome(id || onlineUsersStore.odyssey?.uuid || '');
    handleClose();
  };

  const handleHighFive = (userId: string) => {
    world3dStore?.sendHighFive(userId);
  };

  const handleOdysseyHighFive = () => {
    handleHighFive(onlineUsersStore.odyssey?.uuid || '');
  };

  const handleConnect = () => {
    if (onlineUsersStore.odyssey) {
      nftStore.setConnectToNftItemId(onlineUsersStore.odyssey.id);
    }
  };

  const handleUserClick = (id: string) => {
    if (id === sessionStore.userId) {
      return;
    }
    if (onlineUsersStore.selectedUserId !== id) {
      onlineUsersStore.selectUser(nftStore.getNftByUuid(id));
    } else {
      onlineUsersStore.unselectUser();
    }
  };

  return (
    <Portal>
      <styled.Modal data-testid="SearchUsersWidget-test">
        <styled.OuterContainer>
          <PanelLayout
            title="Online"
            onClose={handleClose}
            headerStyle="uppercase"
            headerIconName="people"
            iconSize="medium"
            showCloseButton
            showOverflow
            componentSize={{width: `${DIALOG_WIDTH_PX}px;`}}
          >
            <styled.Container data-testid="SearchUsersWidget-test">
              <SearchInput
                placeholder={t('placeholders.searchForPeople') || ''}
                onChange={(query: string) => onlineUsersStore.searchUsers(query)}
                onFocus={() => world3dStore?.changeKeyboardControl(false)}
              />
              <styled.List className="noScrollIndicator">
                {onlineUsersStore.listedUsers.map((user) => (
                  <OnlineUser
                    key={user.id}
                    user={sessionStore.user?.id === user.id ? sessionStore.user : user}
                    onTeleportUser={() => handleOdysseyTeleport(user.id)}
                    onUserClick={handleUserClick}
                    onHighFiveUser={handleHighFive}
                    isCurrentUser={user.id === sessionStore.userId}
                    isOwner={user?.id === universeStore.worldId}
                  />
                ))}
              </styled.List>
            </styled.Container>
          </PanelLayout>
          <styled.UsersContainer>
            {onlineUsersStore.selectedUserId && (
              <PanelLayout
                title={onlineUsersStore.odyssey?.name ?? onlineUsersStore.user?.name}
                onClose={onlineUsersStore.unselectUser}
                componentSize={{width: '285px'}}
                headerStyle="uppercase"
                showCloseButton
              >
                <OdysseyInfo
                  user={onlineUsersStore.nftUser}
                  odyssey={onlineUsersStore.odyssey}
                  alreadyConnected={isAlreadyConnected}
                  onVisit={() => handleOdysseyTeleport()}
                  visitDisabled={onlineUsersStore.odyssey?.uuid === universeStore.worldId}
                  onHighFive={handleOdysseyHighFive}
                  onConnect={handleConnect}
                  connectDisabled={
                    onlineUsersStore.odyssey?.uuid === universeStore.worldId || isAlreadyConnected
                  }
                  onCoCreate={() => {}}
                  coCreateDisabled
                />
              </PanelLayout>
            )}
          </styled.UsersContainer>
        </styled.OuterContainer>
      </styled.Modal>
    </Portal>
  );
};

export default observer(SearchUsersWidget);