import {observer} from 'mobx-react-lite';
import {FC} from 'react';

import {createSwitchByConfig} from 'core/utils';
import {ROUTES} from 'core/constants';

import {ODYSSEY_CREATOR_ROUTES} from './OdysseyCreator.routes';

const OdysseyCreator: FC = () => {
  return <>{createSwitchByConfig(ODYSSEY_CREATOR_ROUTES, ROUTES.odyssey.creator.base)}</>;
};

export default observer(OdysseyCreator);
