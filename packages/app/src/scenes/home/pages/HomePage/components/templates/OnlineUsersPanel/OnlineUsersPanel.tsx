import React, {FC, useEffect} from 'react';
import {Position} from 'react-beautiful-dnd';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {useStore, useUnityEvent} from 'shared/hooks';
import {OnlineUsersList} from 'ui-kit';
import {ProfileWidget} from 'scenes/widgets/pages';

import * as styled from './OnlineUsersPanel.styled';

const LAYOUT_WIDTH = '200px';

const OnlineUsersPanel: FC = () => {
  const {sessionStore, widgetStore, mainStore, homeStore, collaborationStore} = useStore();
  const {space} = collaborationStore;
  const {profileMenuStore} = widgetStore;
  const {worldStore, unityStore} = mainStore;
  const {onlineUsersStore} = homeStore;
  const {user} = sessionStore;
  const {profileDialog} = profileMenuStore;

  useUnityEvent('ProfileClickEvent', (id: string, position: Position) => {
    onlineUsersStore.selectUser(id);
  });

  useEffect(() => {
    if (onlineUsersStore.selectedUserId && user && onlineUsersStore.selectedUserId === user.id) {
      return;
    }

    if (profileDialog.isOpen && user) {
      onlineUsersStore.selectUser(user.id);
    }
  }, [profileDialog.isOpen]);

  useEffect(() => {
    if (onlineUsersStore.selectedUserId !== user?.id) {
      onlineUsersStore.endEditingUser();
      profileDialog.close();
    }
  }, [onlineUsersStore.selectedUserId]);

  const handleUserEdit = (userId: string) => {
    onlineUsersStore.editUser(userId);
  };

  return (
    <styled.Container data-testid="OnlineUsersPanel-test">
      {onlineUsersStore.selectedUserId && (
        <div>
          <ProfileWidget
            userId={onlineUsersStore.selectedUserId}
            onClose={() => {
              onlineUsersStore.unselectUser();
              profileDialog.close();
            }}
            onEditUser={handleUserEdit}
          />
        </div>
      )}
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
          spaceId={space?.id ?? ''}
        />
      </styled.CustomExpandableLayout>
    </styled.Container>
  );
};

export default observer(OnlineUsersPanel);
