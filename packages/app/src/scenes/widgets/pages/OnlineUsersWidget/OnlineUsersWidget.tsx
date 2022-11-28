import React, {FC} from 'react';
import {Text} from '@momentum-xyz/ui-kit';

import * as styled from './OnlineUsersWidget.styled';

const OnlineUsersWidget: FC = () => {
  return (
    <styled.Container data-testid="OnlineUsersWidget-test">
      <styled.MyProfileAvatar size="normal" avatarSrc="" />
      <Text size="m" text="Online" transform="uppercase" weight="bold" />
    </styled.Container>
  );
};

export default OnlineUsersWidget;
