import React, {FC, useEffect} from 'react';
import {generatePath, Redirect, Route, Switch, useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {ROUTES} from 'core/constants';
import {usePosBusEvent, useStore} from 'shared/hooks';

import {StageModeGuest, StageModeModerator} from './components';

// TODO: Refactor
const StageModePage: FC = () => {
  const {spaceId} = useParams<{spaceId: string}>();
  const {collaborationStore, mainStore} = useStore();
  const {agoraStore} = mainStore;
  const {stageModeStore} = collaborationStore;

  useEffect(() => {
    const chatWasOpen = agoraStore.isChatOpen;
    agoraStore.showChat();

    return () => {
      if (!chatWasOpen) {
        agoraStore.hideChat();
      }
    };
  }, [agoraStore]);

  usePosBusEvent('stage-mode-accepted', (userId) => {
    stageModeStore.removeRequestPopup(userId);
  });

  usePosBusEvent('stage-mode-declined', (userId) => {
    stageModeStore.removeRequestPopup(userId);
  });

  if (collaborationStore.moderationRequest.isPending) {
    return null;
  }

  return (
    <Switch>
      <Route exact path={generatePath(ROUTES.collaboration.stageMode, {spaceId})}>
        {collaborationStore.isModerator ? (
          <Redirect to={generatePath(ROUTES.collaboration.stageModeControl, {spaceId})} />
        ) : (
          <StageModeGuest />
        )}
      </Route>
      <Route exact path={generatePath(ROUTES.collaboration.stageModeControl, {spaceId})}>
        <StageModeModerator />
      </Route>
    </Switch>
  );
};

export default observer(StageModePage);
