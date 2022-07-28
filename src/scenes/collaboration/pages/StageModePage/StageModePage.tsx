import React, {FC, useEffect} from 'react';
import {generatePath, Redirect, Route, Switch, useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {ROUTES} from 'core/constants';
// TODO: Refactor;
import {useStore} from 'shared/hooks';

import StageModeGuestLayout from '../../../../component/layout/StageMode/StageModeGuestLayout';
import StageModeControlPanelLayout from '../../../../component/layout/StageMode/StageModeControlPanelLayout';

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
          <StageModeGuestLayout />
        )}
      </Route>
      <Route exact path={generatePath(ROUTES.collaboration.stageModeControl, {spaceId})}>
        <StageModeControlPanelLayout />
      </Route>
    </Switch>
  );
};

export default observer(StageModePage);
