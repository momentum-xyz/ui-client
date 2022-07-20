import React, {useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import DashboardVideo from 'component/atoms/video/DashboardVideo';
import {VideoTypeEnum} from 'core/enums';

import * as styled from './VideoPage.styled';

const VideoPage: React.FC = () => {
  const {mainStore, videoStore} = useStore();
  const {unityStore} = mainStore;

  useEffect(() => {
    if (!videoStore.type) {
      unityStore.resume();
    } else {
      unityStore.pause();
    }
  }, [unityStore, videoStore.type]);

  const handleClose = () => {
    videoStore.setType(undefined);
    videoStore.setDashboardId(undefined);
  };

  if (videoStore.type === VideoTypeEnum.DASHBOARD_VIDEO) {
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
