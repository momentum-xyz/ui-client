import React, {FC, useCallback} from 'react';
import {generatePath, Navigate, Route, Routes, useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {useNavigate} from 'react-router';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import {StageModeGuest, StageModeModerator} from './components';

// TODO: Refactor
const StageModePage: FC = () => {
  const {collaborationStore} = useStore();

  const {spaceId} = useParams<{spaceId: string}>();

  const navigate = useNavigate();

  const onLeaveMeeting = useCallback(async () => {
    //await leaveMeetingSpace();
    navigate(ROUTES.base);
  }, [navigate]);

  // FIXME: Make view "rightLoaded" under "collaborationStore"
  if (collaborationStore.spaceStore.moderationRequest.isPending) {
    return null;
  }

  return (
    <Routes>
      <Route exact path={generatePath(ROUTES.collaboration.stageMode, {spaceId})}>
        {collaborationStore.isModerator ? (
          <Route
            path="*"
            element={
              <Navigate
                to={generatePath(ROUTES.collaboration.stageModeControl, {spaceId})}
                replace
              />
            }
          />
        ) : (
          <StageModeGuest onLeaveMeeting={onLeaveMeeting} />
        )}
      </Route>
      <Route exact path={generatePath(ROUTES.collaboration.stageModeControl, {spaceId})}>
        <StageModeModerator onLeaveMeeting={onLeaveMeeting} />
      </Route>
    </Routes>
  );
};

export default observer(StageModePage);
