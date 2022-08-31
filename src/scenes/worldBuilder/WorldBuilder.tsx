import {observer} from 'mobx-react-lite';
import {FC} from 'react';
import {Redirect, Switch} from 'react-router-dom';

import {createRoutesByConfig} from 'core/utils';
import {ROUTES} from 'core/constants';
import background from 'static/images/worldBuilder.png';
import {Page} from 'ui-kit';

import {WORLD_BUILDER_ROUTES} from './WorldBuilder.routes';

const WorldBuilder: FC = () => {
  return (
    <Page backgroundSrc={background}>
      <Switch>
        {createRoutesByConfig(WORLD_BUILDER_ROUTES)}
        <Redirect to={ROUTES.worldBuilder.start} />
      </Switch>
    </Page>
  );
};

export default observer(WorldBuilder);
