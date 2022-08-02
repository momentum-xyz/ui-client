import React, {FC, useEffect} from 'react';
import {Position} from 'react-beautiful-dnd';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {useStore, useUnityEvent} from 'shared/hooks';
import {ExpandableLayout, OnlineUsersList} from 'ui-kit';
import {ProfileEditWidget, ProfileWidget} from 'scenes/widgets/pages';

import * as styled from './OnlineUsersPanel.styled';

const LAYOUT_WIDTH = '200px';

const OnlineUsersPanel: FC = () => {
  const {sessionStore, widgetStore, mainStore, defaultStore, collaborationStore} = useStore();
  const {space} = collaborationStore;
  const {profileMenuStore} = widgetStore;
  const {worldStore, unityStore} = mainStore;
  const {homeStore} = defaultStore;
  const {onlineUsersStore} = homeStore;
  const {profile} = sessionStore;
  const {profileDialog} = profileMenuStore;

  useUnityEvent('ProfileClickEvent', (id: string, position: Position) => {
    onlineUsersStore.selectUser(id);
    console.info('position', position);
  });

  useEffect(() => {
    if (
      onlineUsersStore.selectedUserId &&
      profile &&
      onlineUsersStore.selectedUserId === profile.uuid
    ) {
      return;
    }

    if (profileDialog.isOpen && profile) {
      onlineUsersStore.selectUser(profile.uuid);
    }
  }, [profileDialog.isOpen]);

  useEffect(() => {
    if (onlineUsersStore.selectedUserId !== profile?.uuid) {
      onlineUsersStore.endEditingUser();
      profileDialog.close();
    }
  }, [onlineUsersStore.selectedUserId]);

  const handleUserEdit = (userId: string) => {
    onlineUsersStore.editUser(userId);
  };

  return (
    <styled.Container>
      {onlineUsersStore.selectedUserId && (
        <div>
          {onlineUsersStore.editedUserId ? (
            <ProfileEditWidget
              userId={onlineUsersStore.editedUserId}
              onClose={onlineUsersStore.endEditingUser}
            />
          ) : (
            <ProfileWidget
              userId={onlineUsersStore.selectedUserId}
              onClose={() => {
                onlineUsersStore.unselectUser();
                profileDialog.close();
              }}
              onEditUser={handleUserEdit}
            />
          )}
        </div>
      )}
      <ExpandableLayout
        name={t('labels.people')}
        iconName="people"
        isExpanded={onlineUsersStore.expanded}
        setExpand={onlineUsersStore.toggleExpand}
        size={{width: LAYOUT_WIDTH}}
      >
        <OnlineUsersList
          onlineUsersStore={onlineUsersStore}
          changeKeyboardControl={unityStore.changeKeyboardControl}
          worldId={worldStore.worldId}
          searchQuery={onlineUsersStore.searchQuery}
          profile={profile}
          teleportToUser={unityStore.teleportToUser}
          spaceId={space?.id ?? ''}
        />
      </ExpandableLayout>
    </styled.Container>
  );
};

export default observer(OnlineUsersPanel);
