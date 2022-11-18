import {FC} from 'react';
import {generatePath, Redirect, Route, Switch} from 'react-router-dom';
import {useHistory} from 'react-router';

import {PluginConfigInterface, UsePluginHookType} from '../../../interfaces';
import {SpaceEmulator} from '../SpaceEmulator';
import {ROUTES} from '../../constants';

import * as styled from './WorldEmulator.styled';

const DUMMY_SPACE_ID = '42424242-4242-4242-4242-424242424242';

interface PropsInterface {
  usePlugin: UsePluginHookType<PluginConfigInterface>;
}

export const WorldEmulator: FC<PropsInterface> = ({usePlugin}) => {
  console.log('RENDER WorldEmulator', {usePlugin});

  const history = useHistory();

  return (
    <styled.Container>
      <Switch>
        <Route exact path="/">
          <div>
            <button
              onClick={() =>
                history.push(generatePath(ROUTES.collaboration.base, {spaceId: DUMMY_SPACE_ID}))
              }
            >
              Join Space
            </button>
          </div>
        </Route>
        <Route path={ROUTES.collaboration.base}>
          <SpaceEmulator usePlugin={usePlugin} onClose={() => history.push(ROUTES.base)} />
        </Route>
        <Redirect to={ROUTES.base} />
      </Switch>
    </styled.Container>
  );
};
