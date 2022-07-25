import React, {useCallback, useState} from 'react';
import {generatePath, useHistory} from 'react-router-dom';

import {useUnityEvent} from 'shared/hooks';

import DashboardVideo from '../atoms/video/DashboardVideo';
import {ROUTES} from '../../core/constants';

export interface VideoLayerProps {}

const VideoLayer: React.FC<VideoLayerProps> = () => {
  const [type, setType] = useState<string | null>(null);
  const [dashboardId, setDashboardId] = useState<string | null>(null);

  const history = useHistory();

  useUnityEvent('ClickEventVideo', (id) => {
    console.info('VideoLAYER ClickEventVideo ' + ' - ' + id);

    setDashboardId(id);
    setType('DASHBOARD_VIDEO');
  });

  const close = useCallback(
    async (shouldOpenDashboard = false) => {
      setType(null);

      if (shouldOpenDashboard) {
        console.info('shouldOpenDashboard');
        if (dashboardId) {
          history.push(generatePath(ROUTES.collaboration.dashboard, {id: dashboardId}));
        }
      }

      setDashboardId(null);
    },
    [dashboardId, history]
  );

  if (type === 'DASHBOARD_VIDEO') {
    return <div>{dashboardId && <DashboardVideo dashboardId={dashboardId} onClose={close} />}</div>;
  } else {
    return null;
  }
};

export default VideoLayer;
