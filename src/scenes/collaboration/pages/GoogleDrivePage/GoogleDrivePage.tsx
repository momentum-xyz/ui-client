import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import GoogleDriveLayout from "component/layout/Collaboration/GoogleDriveLayout";

// TODO: Refactor like "MiroBoardPage"
const GoogleDrivePage: FC = () => {
  return <GoogleDriveLayout />
};

export default observer(GoogleDrivePage);
