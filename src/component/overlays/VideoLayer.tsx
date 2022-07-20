import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';

import {useUnityEvent} from 'shared/hooks';

import DashboardVideo from '../atoms/video/DashboardVideo';
import {useJoinCollaborationSpaceByAssign} from '../../context/Collaboration/hooks/useCollaboration';
import {ROUTES} from '../../core/constants';

export interface VideoLayerProps {}

const VideoLayer: React.FC<VideoLayerProps> = () => {
  const [type, setType] = useState<string | null>(null);
  const [dashboardId, setDashboardId] = useState<string | null>(null);

  const joinMeetingSpace = useJoinCollaborationSpaceByAssign();
  const history = useHistory();

  useUnityEvent('ClickEventVideo', (id) => {
    console.info('VideoLAYER ClickEventVideo ' + ' - ' + id);

    setDashboardId(id);
    setType('DASHBOARD_VIDEO');
  });

  const close = (shouldOpenDashboard = false) => {
    setType(null);

    if (shouldOpenDashboard) {
      console.info('shouldOpenDashboard');
      if (dashboardId) {
        // TODO: Refactoring
        joinMeetingSpace(dashboardId).then(() => {
          history.push({pathname: ROUTES.collaboration.dashboard});
        });
      }
    }

    setDashboardId(null);
  };

  if (type === 'DASHBOARD_VIDEO') {
    return <div>{dashboardId && <DashboardVideo dashboardId={dashboardId} onClose={close} />}</div>;
  } else {
    return null;
  }
};

export default VideoLayer;
