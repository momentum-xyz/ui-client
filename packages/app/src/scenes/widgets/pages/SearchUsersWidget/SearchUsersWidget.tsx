import {observer} from 'mobx-react-lite';
import React, {FC, useEffect} from 'react';
import {generatePath, useHistory} from 'react-router-dom';
import {PanelLayout, Portal, SearchInput} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

import {OdysseyInfo} from 'ui-kit/molecules/OdysseyInfo';
import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import * as styled from './SearchUsersWidget.styled';
import {OnlineUser} from './components';

const DIALOG_WIDTH_PX = 296;

const SearchUsersWidget: FC = () => {
  const {mainStore, widgetsStore, nftStore, authStore, sessionStore} = useStore();
  const {unityStore, worldStore} = mainStore;
  const {onlineUsersStore} = widgetsStore;

  const isAlreadyConnected = nftStore.isAlreadyConnected(onlineUsersStore.odyssey?.owner || '');

  const {t} = useTranslation();
  const history = useHistory();

  useEffect(() => {
    unityStore.changeKeyboardControl(false);

    return () => {
      unityStore.changeKeyboardControl(true);
    };
  }, [unityStore]);

  const handleClose = () => {
    onlineUsersStore.searchWidget.close();
    onlineUsersStore?.unselectUser();
    onlineUsersStore.searchUsers('');
  };

  const handleTeleport = (userId: string) => {
    handleClose();
    unityStore.teleportToUser(userId);
  };

  const handleOdysseyTeleport = () => {
    const worldId = onlineUsersStore.odyssey?.uuid || '';
    handleClose();

    history.replace(generatePath(ROUTES.odyssey.base, {worldId}));
    unityStore.loadWorldById(worldId, authStore.token);
  };

  const handleHighFive = (userId: string) => {
    unityStore.sendHighFive(userId);
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
                placeholder={t('placeholders.searchForPeople')}
                onChange={(query: string) => onlineUsersStore.searchUsers(query)}
                onFocus={() => unityStore.changeKeyboardControl(false)}
              />
              <styled.List className="noScrollIndicator">
                {onlineUsersStore.searchedUsers && onlineUsersStore.searchedUsers.length > 0
                  ? onlineUsersStore.searchedUsers.map((user) => (
                      <OnlineUser
                        key={user.id}
                        user={user}
                        onTeleportUser={handleTeleport}
                        onUserClick={handleUserClick}
                        onHighFiveUser={handleHighFive}
                        isCurrentUser={user.id === sessionStore.userId}
                        isCurrentWorld={user?.id === worldStore.worldId}
                      />
                    ))
                  : !onlineUsersStore.query &&
                    onlineUsersStore.allUsers.map((user) => (
                      <OnlineUser
                        key={user.id}
                        user={user}
                        onTeleportUser={handleTeleport}
                        onUserClick={handleUserClick}
                        onHighFiveUser={handleHighFive}
                        isCurrentUser={user.id === sessionStore.userId}
                        isCurrentWorld={user?.id === worldStore.worldId}
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
                  onVisit={handleOdysseyTeleport}
                  visitDisabled={
                    !onlineUsersStore.nftId || onlineUsersStore.odyssey?.uuid === worldStore.worldId
                  }
                  onHighFive={handleOdysseyHighFive}
                  onConnect={handleConnect}
                  connectDisabled={
                    !onlineUsersStore.nftId ||
                    onlineUsersStore.odyssey?.uuid === worldStore.worldId ||
                    isAlreadyConnected
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
