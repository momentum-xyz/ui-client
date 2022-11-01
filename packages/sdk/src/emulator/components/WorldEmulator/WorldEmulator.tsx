import {FC} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {useHistory} from 'react-router';

import {PluginInterface} from '../../../interfaces';
import {SpaceEmulator} from '../SpaceEmulator';

import * as styled from './WorldEmulator.styled';

const DUMMY_SPACE_ID = '42424242-4242-4242-4242-424242424242';

interface PropsInterface {
  plugin: PluginInterface;
}

export const WorldEmulator: FC<PropsInterface> = ({plugin}) => {
  console.log('RENDER WorldEmulator', {plugin});

  const history = useHistory();

  return (
    <styled.Container>
      <Switch>
        <Route exact path="/">
          <div>
            <button onClick={() => history.push(`/collaboration/${DUMMY_SPACE_ID}`)}>
              Join Space
            </button>
          </div>
        </Route>
        <Route path="/collaboration/:spaceId">
          <SpaceEmulator plugin={plugin} onClose={() => history.push('/')} />
        </Route>
        <Redirect to="/" />
      </Switch>
    </styled.Container>
  );
};
