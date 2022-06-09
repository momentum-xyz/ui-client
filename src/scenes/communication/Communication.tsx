import React from 'react';
import {observer} from 'mobx-react-lite';

import {CommunicationLayer} from './pages';

const Communication: React.FC = () => {
  return <CommunicationLayer />;
};

export default observer(Communication);
