import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {UserModelInterface} from 'core/models';

import * as styled from './OnlineUsersAvatars.styled';

interface PropsInterface {
  onlineUsers: UserModelInterface[];
}

const OnlineUsersAvatars: FC<PropsInterface> = ({onlineUsers}) => {
  return (
    <styled.Container data-testid="OnlineUsersAvatars-test">
      {onlineUsers.length > 15 ? (
        <>
          <styled.UsersCount text={`+${onlineUsers.length - 15}`} size="xxs" weight="bold" />
          {onlineUsers.slice(0, 15).map((user) => (
            <styled.ProfileAvatar key={user.id} size="normal" avatarSrc={user.avatarSrc} />
          ))}
        </>
      ) : (
        onlineUsers.length > 0 &&
        onlineUsers.map((user) => (
          <styled.ProfileAvatar key={user.id} size="normal" avatarSrc={user.avatarSrc} />
        ))
      )}
    </styled.Container>
  );
};

export default observer(OnlineUsersAvatars);
