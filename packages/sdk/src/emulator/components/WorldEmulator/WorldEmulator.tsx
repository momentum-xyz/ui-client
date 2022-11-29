import React, {FC} from 'react';
import {generatePath, Redirect, Route, Switch} from 'react-router-dom';
import {useHistory} from 'react-router';

import {ObjectPluginPropsInterface, PluginInterface} from '../../../interfaces';
import {SpaceEmulator} from '../SpaceEmulator';
import {ROUTES} from '../../constants';

import * as styled from './WorldEmulator.styled';

const DUMMY_SPACE_ID = '42424242-4242-4242-4242-424242424242';

interface PropsInterface {
  plugin: PluginInterface<ObjectPluginPropsInterface>;
}

export const WorldEmulator: FC<PropsInterface> = ({plugin}) => {
  console.log('RENDER WorldEmulator', {plugin});

  const history = useHistory();

  return (
    <styled.Container>
      <Switch>
        <Route exact path="/">
          <div>
            <styled.Button
              onClick={() =>
                history.push(generatePath(ROUTES.collaboration.plugin, {objectId: DUMMY_SPACE_ID}))
              }
            >
              Open Plugin
            </styled.Button>
          </div>
        </Route>
        <Route path={ROUTES.collaboration.plugin}>
          <SpaceEmulator plugin={plugin} onClose={() => history.push(ROUTES.base)} />
        </Route>
        <Redirect to={ROUTES.base} />
      </Switch>
    </styled.Container>
  );
};
