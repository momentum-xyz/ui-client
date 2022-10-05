import React, {FC, useCallback, useEffect} from 'react';
import {generatePath, Redirect, Route, Switch, useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import {StageModeGuest, StageModeModerator} from './components';

// TODO: Refactor
const StageModePage: FC = () => {
  const {collaborationStore, mainStore, leaveMeetingSpace} = useStore();
  const {streamChatStore} = collaborationStore;
  const {agoraStore} = mainStore;

  const {spaceId} = useParams<{spaceId: string}>();

  const history = useHistory();

  useEffect(() => {
    const chatWasOpen = streamChatStore.textChatDialog.isOpen;
    streamChatStore.textChatDialog.open();

    return () => {
      if (!chatWasOpen) {
        streamChatStore.textChatDialog.close();
      }
    };
  }, [agoraStore]);

  const onLeaveMeeting = useCallback(async () => {
    await leaveMeetingSpace();
    history.push(ROUTES.base);
  }, [history, leaveMeetingSpace]);

  if (collaborationStore.moderationRequest.isPending) {
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
