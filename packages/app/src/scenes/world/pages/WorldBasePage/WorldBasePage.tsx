import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';

import * as styled from './WorldBasePage.styled';

const WorldBasePage: FC = () => {
  const {universeStore} = useStore();
  const {world2dStore} = universeStore;

  return (
    <styled.Container data-testid="WorldBasePage-test">
      <styled.OnlineUsers>
        <div>Users:</div>
        {world2dStore?.onlineUsersList.map((user) => (
          <div key={user.id}>{user.name}</div>
        ))}
      </styled.OnlineUsers>

      <styled.World>
        <div>World:</div>
        <div>{world2dStore?.worldId}</div>
      </styled.World>
    </styled.Container>
  );
};

export default observer(WorldBasePage);
