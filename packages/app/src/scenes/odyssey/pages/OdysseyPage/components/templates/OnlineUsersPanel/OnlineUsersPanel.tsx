import React, {FC, useEffect} from 'react';
import {Position} from 'react-beautiful-dnd';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {useStore, useUnityEvent} from 'shared/hooks';
import {OnlineUsersList} from 'ui-kit';

import * as styled from './OnlineUsersPanel.styled';

const LAYOUT_WIDTH = '200px';

const OnlineUsersPanel: FC = () => {
  const {sessionStore, mainStore, odysseyStore, unityStore, collaborationStore} = useStore();
  const {spaceStore} = collaborationStore;
  const {worldStore} = mainStore;
  const {onlineUsersStore, userProfileDialog} = odysseyStore;
  const {user} = sessionStore;

  useUnityEvent('ProfileClickEvent', (id: string, position: Position) => {
    onlineUsersStore.selectUser(id);
  });

  useEffect(() => {
    if (onlineUsersStore.selectedUserId && user && onlineUsersStore.selectedUserId === user.id) {
      return;
    }

    if (userProfileDialog.isOpen && user) {
      onlineUsersStore.selectUser(user.id);
    }
  }, [userProfileDialog.isOpen]);

  useEffect(() => {
    if (onlineUsersStore.selectedUserId !== user?.id) {
      onlineUsersStore.endEditingUser();
      userProfileDialog.close();
    }
  }, [onlineUsersStore, onlineUsersStore.selectedUserId, user?.id, userProfileDialog]);

  return (
    <styled.CustomExpandableLayout
      name={t('labels.people')}
      iconName="people"
      isExpanded={onlineUsersStore.expanded}
      setExpand={onlineUsersStore.toggleExpand}
      size={{width: LAYOUT_WIDTH}}
    >
      <OnlineUsersList
        onlineUsersStore={onlineUsersStore}
        onlineUsersList={onlineUsersStore.onlineUsersList}
        changeKeyboardControl={unityStore.changeKeyboardControl}
        worldId={worldStore.worldId}
        user={user ?? undefined}
        teleportToUser={unityStore.teleportToUser}
        spaceId={spaceStore?.id ?? ''}
      />
    </styled.CustomExpandableLayout>
  );
};

export default observer(OnlineUsersPanel);
