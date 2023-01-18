import React, {FC, useCallback, useState} from 'react';
import {generatePath, Redirect, Route, Switch} from 'react-router-dom';
import {useHistory} from 'react-router';
import {Toggle, Text} from '@momentum-xyz/ui-kit';

import {PluginInterface} from '../../../interfaces';
import {ObjectViewEmulator} from '../ObjectViewEmulator';
import {ROUTES} from '../../constants';

import * as styled from './WorldEmulator.styled';

const DUMMY_SPACE_ID = '42424242-4242-4242-4242-424242424242';

const LOCAL_STORAGE_KEY = 'sdk_emulator_is_admin';
const initialIsAdmin = !(window.localStorage.getItem(LOCAL_STORAGE_KEY) === 'false');

interface PropsInterface {
  plugin: PluginInterface;
}

export const WorldEmulator: FC<PropsInterface> = ({plugin}) => {
  console.log('RENDER WorldEmulator', {plugin});

  const history = useHistory();
  const onClose = useCallback(() => history.push(ROUTES.base), [history]);

  const [isAdmin, _setIsAdmin] = useState(initialIsAdmin);
  const setIsAdmin = () => {
    const newIsAdmin = !isAdmin;
    _setIsAdmin(newIsAdmin);
    window.localStorage.setItem(LOCAL_STORAGE_KEY, newIsAdmin.toString());
  };

  return (
    <styled.Container>
      <styled.ControlPanel>
        <Toggle size="normal" variant="normal" checked={isAdmin} onChange={setIsAdmin} />
        <Text text="Is User Admin" size="m" />
      </styled.ControlPanel>
      <Switch>
        <Route exact path="/">
          <div>
            <styled.Button
              onClick={() => history.push(generatePath(ROUTES.plugin, {objectId: DUMMY_SPACE_ID}))}
            >
              Open Plugin
            </styled.Button>
          </div>
        </Route>
        <Route path={ROUTES.plugin}>
          <ObjectViewEmulator plugin={plugin} isAdmin={isAdmin} onClose={onClose} />
        </Route>
        <Redirect to={ROUTES.base} />
      </Switch>
    </styled.Container>
  );
};
