import React, {FC, useEffect} from 'react';
import {generatePath, Redirect, Route, Switch, useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {ROUTES} from 'core/constants';
// TODO: Refactor;
import {useStore} from 'shared/hooks';

import {useModerator} from '../../../../context/Integration/hooks/useIntegration';
import StageModeGuestLayout from '../../../../component/layout/StageMode/StageModeGuestLayout';
import StageModeControlPanelLayout from '../../../../component/layout/StageMode/StageModeControlPanelLayout';

// TODO: Refactor
const StageModePage: FC = () => {
  const {spaceId} = useParams<{spaceId: string}>();
  const {agoraStore} = useStore().mainStore;

  const [isModerator, moderatorLoading, ,] = useModerator(agoraStore.spaceId ?? '');

  useEffect(() => {
    const chatWasOpen = agoraStore.isChatOpen;
    agoraStore.showChat();

    return () => {
      if (!chatWasOpen) {
        agoraStore.hideChat();
      }
    };
  }, [agoraStore]);

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

export default observer(StageModePage);
