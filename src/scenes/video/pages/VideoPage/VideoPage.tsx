import React, {useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {useJoinCollaborationSpaceByAssign} from 'context/Collaboration/hooks/useCollaboration';
import {useStore, useUnityEvent} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import DashboardVideo from 'component/atoms/video/DashboardVideo';

import * as styled from './VideoPage.styled';

const VideoPage: React.FC = () => {
  const {
    mainStore: {unityStore},
    videoStore
  } = useStore();
  const joinMeetingSpace = useJoinCollaborationSpaceByAssign();
  const history = useHistory();

  useEffect(() => {
    if (!videoStore.type) {
      unityStore.resume();
    } else {
      unityStore.pause();
    }
  }, [unityStore, videoStore.type]);

  useUnityEvent('ClickEventVideo', videoStore.handleClickEventVideo);

  const handleClose = () => {
    videoStore.close(joinMeetingSpace, unityStore.pause, () => {
      history.push({pathname: ROUTES.dashboard});
    });
  };

  if (videoStore.type === 'DASHBOARD_VIDEO') {
    return (
      <styled.Container>
        {videoStore.dashboardId && (
          <DashboardVideo dashboardId={videoStore.dashboardId} onClose={handleClose} />
        )}
      </styled.Container>
    );
  } else {
    return null;
  }
};

export default observer(VideoPage);
