import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {Dialog, OnlineUsersList} from 'ui-kit';
import {useStore} from 'shared/hooks';

import * as styled from './InviteToSpaceMenu.styled';

interface PropsInterface {
  onClose: () => void;
  leftOffSet?: number;
}

const InviteToSpaceMenu: FC<PropsInterface> = ({onClose, leftOffSet}) => {
  const {t} = useTranslation();

  const {sessionStore, mainStore, collaborationStore} = useStore();
  const {worldStore, unityStore} = mainStore;
  const {space, dashboardStore} = collaborationStore;
  const {inviteUsersStore} = dashboardStore;
  const {onlineUsersList} = inviteUsersStore;
  const {profile} = sessionStore;

  return (
    <Dialog
      title={t('titles.inviteUsers')}
      headerStyle="uppercase"
      position="leftTop"
      icon="alert"
      iconSize="medium-large"
      offset={{top: 80, left: leftOffSet}}
      onClose={onClose}
      showBackground={false}
      showCloseButton
    >
      <styled.Container>
        <OnlineUsersList
          usersStore={inviteUsersStore}
          teleportToUser={unityStore.teleportToUser}
          spaceId={space?.id ?? ''}
          profile={profile ?? undefined}
          onlineUsersList={onlineUsersList}
          searchQuery={onlineUsersList.searchQuery}
          worldId={worldStore.worldId}
          changeKeyboardControl={unityStore.changeKeyboardControl}
          invite
        />
      </styled.Container>
    </Dialog>
  );
};

export default observer(InviteToSpaceMenu);
