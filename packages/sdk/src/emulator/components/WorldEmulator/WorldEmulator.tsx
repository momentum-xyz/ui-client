import React, {FC} from 'react';
import {generatePath, Navigate, Route, Routes, useNavigate} from 'react-router-dom';

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

  const navigate = useNavigate();

  return (
    <styled.Container>
      <Routes>
        <Route path="/">
          <div>
            <styled.Button
              onClick={() =>
                navigate(generatePath(ROUTES.collaboration.plugin, {objectId: DUMMY_SPACE_ID}))
              }
            >
              Open Plugin
            </styled.Button>
          </div>
        </Route>
        <Route path={ROUTES.collaboration.plugin}>
          <SpaceEmulator plugin={plugin} onClose={() => navigate(ROUTES.base)} />
        </Route>
        <Route path="*" element={<Navigate to={ROUTES.base} replace />} />
      </Routes>
    </styled.Container>
  );
};
