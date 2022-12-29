import React, {FC, useCallback} from 'react';
import {generatePath, Redirect, Route, Switch, useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import {StageModeGuest, StageModeModerator} from './components';

// TODO: Refactor
const StageModePage: FC = () => {
  const {collaborationStore} = useStore();

  const {spaceId} = useParams<{spaceId: string}>();

  const history = useHistory();

  const onLeaveMeeting = useCallback(async () => {
    //await leaveMeetingSpace();
    history.push(ROUTES.base);
  }, [history]);

  // FIXME: Make view "rightLoaded" under "collaborationStore"
  if (collaborationStore.spaceStore.moderationRequest.isPending) {
    return null;
  }

  return (
    <Switch>
      <Route exact path={generatePath(ROUTES.collaboration.stageMode, {spaceId})}>
        {collaborationStore.isModerator ? (
          <Redirect to={generatePath(ROUTES.collaboration.stageModeControl, {spaceId})} />
        ) : (
          <StageModeGuest onLeaveMeeting={onLeaveMeeting} />
        )}
      </Route>
      <Route exact path={generatePath(ROUTES.collaboration.stageModeControl, {spaceId})}>
        <StageModeModerator onLeaveMeeting={onLeaveMeeting} />
      </Route>
    </Switch>
  );
};

export default observer(StageModePage);
