import React, {useEffect} from 'react';
import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom';

import {COLLABORATION_CHAT_ACTION_UPDATE} from '../../../context/Collaboration/CollaborationReducer';
import useCollaboration from '../../../context/Collaboration/hooks/useCollaboration';
import {StageModePopupQueueProvider} from '../../../context/StageMode/StageModePopupQueueContext';
import {useModerator} from '../../../context/Integration/hooks/useIntegration';

import StageModeGuestLayout from './StageModeGuestLayout';
import StageModeControlPanelLayout from './StageModeControlPanelLayout';

const StageModeRouter: React.FC = () => {
  const {path} = useRouteMatch();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StageModePopupQueueProvider>
      <Switch>
        <Route exact path={`${path}/`}>
          {!moderatorLoading &&
            (isModerator ? <Redirect to={`${path}/control-panel`} /> : <StageModeGuestLayout />)}
        </Route>
        <Route exact path={`${path}/control-panel`}>
          <StageModeControlPanelLayout />
        </Route>
      </Switch>
    </StageModePopupQueueProvider>
  );
};

export default StageModeRouter;
