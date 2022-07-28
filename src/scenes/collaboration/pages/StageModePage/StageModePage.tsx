import React, {FC, useEffect} from 'react';
import {generatePath, Redirect, Route, Switch, useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import StageModeControlPanelLayout from '../../../../component/layout/StageMode/StageModeControlPanelLayout';

import {StageModeGuest} from './components';

// TODO: Refactor
const StageModePage: FC = () => {
  const {spaceId} = useParams<{spaceId: string}>();
  const {collaborationStore, mainStore} = useStore();
  const {agoraStore} = mainStore;

  useEffect(() => {
    const chatWasOpen = agoraStore.isChatOpen;
    agoraStore.showChat();

    return () => {
      if (!chatWasOpen) {
        agoraStore.hideChat();
      }
    };
  }, [agoraStore]);

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
        <StageModeControlPanelLayout />
      </Route>
    </Switch>
  );
};

export default observer(StageModePage);
