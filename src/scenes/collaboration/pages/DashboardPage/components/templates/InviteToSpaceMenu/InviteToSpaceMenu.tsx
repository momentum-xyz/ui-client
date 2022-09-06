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
  const {worldStore, unityStore, agoraStore} = mainStore;
  const {space, dashboardStore} = collaborationStore;
  const {onlineUsersList} = dashboardStore;
  const {profile} = sessionStore;

  return (
    <Dialog
      title={t('titles.inviteUsers')}
      headerStyle="uppercase"
      position="leftTop"
      icon="people"
      iconSize="medium-large"
      offset={{top: 80, left: leftOffSet}}
      onClose={onClose}
      showBackground={false}
      showCloseButton
    >
      <styled.Container>
        <OnlineUsersList
          teleportToUser={unityStore.teleportToUser}
          spaceId={space?.id ?? ''}
          profile={profile ?? undefined}
          onlineUsersList={onlineUsersList}
          worldId={worldStore.worldId}
          changeKeyboardControl={unityStore.changeKeyboardControl}
          excludedPeople={agoraStore.meetingPeopleIds}
          invite
        />
      </styled.Container>
    </Dialog>
  );
};

export default observer(InviteToSpaceMenu);
