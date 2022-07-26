import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import ScreenShareLayout from 'component/layout/Collaboration/ScreenShareLayout';

// TODO: Refactor like "MiroBoardPage"
const ScreenSharePage: FC = () => {
  return <ScreenShareLayout />;
};

export default observer(ScreenSharePage);
