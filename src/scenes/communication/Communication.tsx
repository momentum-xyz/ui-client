import {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {CommunicationLayer} from './pages';

const Communication: FC = () => {
  return <CommunicationLayer />;
};

export default observer(Communication);
