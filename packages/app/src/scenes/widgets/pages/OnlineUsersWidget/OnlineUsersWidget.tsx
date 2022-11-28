import React, {FC} from 'react';
import {Text} from '@momentum-xyz/ui-kit';

import {UserModelInterface} from 'core/models';

import * as styled from './OnlineUsersWidget.styled';

interface PropsInterface {
  currentUser: UserModelInterface | null;
}

const OnlineUsersWidget: FC<PropsInterface> = ({currentUser}) => {
  return (
    <styled.Container data-testid="OnlineUsersWidget-test">
      <styled.MyProfileAvatar size="normal" avatarSrc={currentUser?.avatarSrc} />
      <Text size="m" text="Online" transform="uppercase" weight="bold" />
    </styled.Container>
  );
};

export default OnlineUsersWidget;
