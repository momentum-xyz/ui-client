import {observer} from 'mobx-react-lite';
import {FC} from 'react';

import {createSwitchByConfig} from 'core/utils';
import {ROUTES} from 'core/constants';

import {WORLD_BUILDER_ROUTES} from './WorldBuilder.routes';

const WorldBuilder: FC = () => {
  return <>{createSwitchByConfig(WORLD_BUILDER_ROUTES, ROUTES.worldBuilder.start)}</>;
};

export default observer(WorldBuilder);
