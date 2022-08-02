import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {Dialog} from 'ui-kit';

import {OnlineUsersList} from '../../../../../../default/pages/HomePage/components';

import * as styled from './InviteToSpaceMenu.styled';

interface PropsInterface {
  onClose: () => void;
  leftOffSet?: number;
}

const InviteToSpaceMenu: FC<PropsInterface> = ({onClose, leftOffSet}) => {
  return (
    <Dialog
      title="Invite users"
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
        <OnlineUsersList invite />
      </styled.Container>
    </Dialog>
  );
};

export default observer(InviteToSpaceMenu);
