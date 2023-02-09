import {FC, useCallback, useState} from 'react';
import {generatePath, Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import * as uiKit from '@momentum-xyz/ui-kit';

import {PluginInterface} from '../../../interfaces';
import {ObjectViewEmulator} from '../ObjectViewEmulator';
import {ConfigEmulator} from '../ConfigEmulator';
import {useConfigEmulatorStorage} from '../../../hooks';
import { ROUTES } from '../../constants';

import * as styled from './WorldEmulator.styled';

const DUMMY_SPACE_ID = '42424242-4242-4242-4242-424242424242';

const LOCAL_STORAGE_KEY = 'sdk_emulator_is_admin';
const initialIsAdmin = !(window.localStorage.getItem(LOCAL_STORAGE_KEY) === 'false');

interface PropsInterface {
  plugin: PluginInterface;
}

export const WorldEmulator: FC<PropsInterface> = ({plugin}) => {
  console.log('RENDER WorldEmulator', {plugin});

  const navigate = useNavigate();
  const onClose = useCallback(() => navigate(ROUTES.base), [navigate]);

  // TODO get plugin type here
  const {data: storedConfig, onSave: _onSaveConfig} = useConfigEmulatorStorage(
    window.location.origin
  );
  // TODO pass config to plugin
  const onSaveConfig = (data: unknown) => {
    _onSaveConfig(data);
    onClose();
  };

  const [isAdmin, _setIsAdmin] = useState(initialIsAdmin);
  const setIsAdmin = () => {
    const newIsAdmin = !isAdmin;
    _setIsAdmin(newIsAdmin);
    window.localStorage.setItem(LOCAL_STORAGE_KEY, newIsAdmin.toString());
  };

  return (
    <styled.Container>
      <styled.ControlPanel>
        <uiKit.Toggle size="normal" variant="normal" checked={isAdmin} onChange={setIsAdmin} />
        <uiKit.Text text="Is User Admin" size="m" />
      </styled.ControlPanel>
      <Routes>
        <Route path="/">
          <div>
            <styled.Button
              onClick={() =>
                navigate(generatePath(ROUTES.plugin, {objectId: DUMMY_SPACE_ID}))
              }
            >
              Open Object
            </styled.Button>
            &nbsp;
            {isAdmin && (
              <styled.Button onClick={() => navigate(ROUTES.config)}>Open Config</styled.Button>
            )}
          </div>
        </Route>
        <Route path={ROUTES.plugin}>
          <ObjectViewEmulator plugin={plugin} isAdmin={isAdmin} onClose={onClose} />
        </Route>
        <Route path={ROUTES.config}>
          {isAdmin ? (
            <ConfigEmulator
              config={storedConfig}
              plugin={plugin}
              onSave={onSaveConfig}
              onClose={onClose}
            />
          ) : (
            <div>No permission for this page</div>
          )}
        </Route>
        <Route path="*" element={<Navigate to={ROUTES.base} replace />} />
      </Routes>
    </styled.Container>
  );
};
