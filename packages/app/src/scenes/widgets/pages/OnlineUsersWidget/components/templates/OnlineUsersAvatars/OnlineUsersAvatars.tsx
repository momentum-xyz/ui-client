import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {OdysseyUserInterface} from '../../../../../stores/OnlineUsersStore';

import * as styled from './OnlineUsersAvatars.styled';

interface PropsInterface {
  onlineUsers: OdysseyUserInterface[];
}

const OnlineUsersAvatars: FC<PropsInterface> = ({onlineUsers}) => {
  return (
    <styled.Container data-testid="OnlineUsersAvatars-test">
      {onlineUsers.length > 15 ? (
        <>
          <styled.UsersCount text={`+${onlineUsers.length - 15}`} size="xxs" weight="bold" />
          {onlineUsers.slice(0, 15).map((user) => (
            <styled.ProfileAvatar key={user.id} size="normal" avatarSrc={user.avatar_hash} />
          ))}
        </>
      ) : (
        onlineUsers.map((user) => (
          <styled.ProfileAvatar key={user.id} size="normal" avatarSrc={user.avatar_hash} />
        ))
      )}
    </styled.Container>
  );
};

export default observer(OnlineUsersAvatars);
