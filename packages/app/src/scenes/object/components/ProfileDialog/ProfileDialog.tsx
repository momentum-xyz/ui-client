import {Dialog} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {FC} from 'react';

import * as styled from './ProfileDialog.styled';

const ProfileDialog: FC = () => {
  return (
    <Dialog title="Profile" position="topLeft">
      <styled.Body></styled.Body>
    </Dialog>
  );
};

export default observer(ProfileDialog);
