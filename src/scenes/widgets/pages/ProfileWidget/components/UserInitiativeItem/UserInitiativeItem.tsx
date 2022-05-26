import {observer} from 'mobx-react-lite';
import React, {FC} from 'react';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useJoinCollaborationSpaceByAssign} from 'context/Collaboration/hooks/useCollaboration';
import {useStore} from 'shared/hooks';
import {SvgButton} from 'ui-kit';

import * as styled from './UserInitiativeItem.styled';

interface UserInitiativeItemPropsInterface {
  spaceName: string;
  spaceId: string;
}

const UserInitiativeItem: FC<UserInitiativeItemPropsInterface> = ({spaceName, spaceId}) => {
  const {
    defaultStore: {homeStore},
    mainStore: {unityStore}
  } = useStore();

  const {exploreStore} = homeStore;

  const history = useHistory();
  const joinMeetingSpace = useJoinCollaborationSpaceByAssign();

  const handleClick = () => {
    exploreStore.selectSpace(spaceId);
  };

  const handleFlyToSpace = () => {
    unityStore.teleportToSpace(spaceId);
    history.push(ROUTES.base);

    if (process.env.NODE_ENV === 'development') {
      joinMeetingSpace(spaceId).then();
    }
  };

  return (
    <styled.Container key={spaceId} onClick={handleClick}>
      <SvgButton iconName="rocket" size="medium" onClick={handleFlyToSpace} />
      <styled.NameText text={spaceName} size="xs" align="left" />
    </styled.Container>
  );
};

export default observer(UserInitiativeItem);
