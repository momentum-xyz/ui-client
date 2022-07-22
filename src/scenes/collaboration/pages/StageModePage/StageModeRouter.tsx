import React, {FC, memo, useEffect} from 'react';
import {generatePath, Redirect, Route, Switch, useParams} from 'react-router-dom';

import {ROUTES} from 'core/constants';

// TODO: Refactor
import {COLLABORATION_CHAT_ACTION_UPDATE} from '../../../../context/Collaboration/CollaborationReducer';
import useCollaboration from '../../../../context/Collaboration/hooks/useCollaboration';
import {useModerator} from '../../../../context/Integration/hooks/useIntegration';
import StageModeGuestLayout from '../../../../component/layout/StageMode/StageModeGuestLayout';
import StageModeControlPanelLayout from '../../../../component/layout/StageMode/StageModeControlPanelLayout';

// TODO: Refactor
const StageModeRouter: FC = () => {
  const {spaceId} = useParams<{spaceId: string}>();

  const {collaborationState, collaborationDispatch} = useCollaboration();
  const [isModerator, moderatorLoading, ,] = useModerator(
    // @ts-ignore
    collaborationState.collaborationSpace?.id
  );

  useEffect(() => {
    const chatOpen = collaborationState.chatOpen;
    collaborationDispatch({
      type: COLLABORATION_CHAT_ACTION_UPDATE,
      open: true
    });

    return () => {
      collaborationDispatch({
        type: COLLABORATION_CHAT_ACTION_UPDATE,
        open: chatOpen
      });
    };
  }, []);

  if (moderatorLoading) {
    return null;
  }

  return (
    <Switch>
      <Route exact path={generatePath(ROUTES.collaboration.stageMode, {spaceId})}>
        {isModerator ? (
          <Redirect to={generatePath(ROUTES.collaboration.stageModeControl, {spaceId})} />
        ) : (
          <StageModeGuestLayout />
        )}
      </Route>
      <Route exact path={generatePath(ROUTES.collaboration.stageModeControl, {spaceId})}>
        <StageModeControlPanelLayout />
      </Route>
    </Switch>
  );
};

export default memo(StageModeRouter);
