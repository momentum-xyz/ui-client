import {observer} from 'mobx-react-lite';
import {FC} from 'react';
import {Redirect, Switch} from 'react-router-dom';

import {createRoutesByConfig} from 'core/utils';
import {ROUTES} from 'core/constants';
import background from 'static/images/worldBuilder.png';

import {WORLD_BUILDER_ROUTES} from './WorldBuilder.routes';
import * as styled from './WorldBuilder.styled';

const WorldBuilder: FC = () => {
  return (
    <styled.Container>
      <styled.Background src={background} />
      <styled.BackgroundFilter />

      <styled.PageContainer>
        <Switch>
          {createRoutesByConfig(WORLD_BUILDER_ROUTES)}
          <Redirect to={ROUTES.worldBuilder.start} />
        </Switch>
      </styled.PageContainer>
    </styled.Container>
  );
};

export default observer(WorldBuilder);
