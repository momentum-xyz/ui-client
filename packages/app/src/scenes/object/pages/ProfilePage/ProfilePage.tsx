import {observer} from 'mobx-react-lite';
import {FC} from 'react';

import {ProfileDialog} from 'scenes/object/components';

const ProfilePage: FC = () => {
  return (
    <>
      <ProfileDialog />
    </>
  );
};

export default observer(ProfilePage);
