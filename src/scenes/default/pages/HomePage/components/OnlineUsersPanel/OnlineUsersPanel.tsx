import React, {FC, useEffect} from 'react';
import {Position} from 'react-beautiful-dnd';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import useUnityEvent from 'context/Unity/hooks/useUnityEvent';
import {useStore} from 'shared/hooks';
import {ExpandableLayout} from 'ui-kit';
import {ProfileEditWidget, ProfileWidget} from 'scenes/widgets/pages';
import {OnlineUsersList} from 'scenes/default/pages/HomePage/components';

import * as styled from './OnlineUsersPanel.styled';

const LAYOUT_WIDTH = '200px';

const OnlineUsersPanel: FC = () => {
  const {
    sessionStore,
    widgetStore: {profileMenuStore},
    defaultStore: {homeStore}
  } = useStore();
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
        <OnlineUsersList />
      </ExpandableLayout>
    </styled.Container>
  );
};

export default observer(OnlineUsersPanel);
