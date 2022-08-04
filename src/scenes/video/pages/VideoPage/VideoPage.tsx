import React, {useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useParams} from 'react-router-dom';
import {useHistory} from 'react-router';

import {useStore} from 'shared/hooks';

import * as styled from './VideoPage.styled';
import {DashboardVideo} from './components';

const VideoPage: React.FC = () => {
  const {videoStore} = useStore();

  const history = useHistory();

  const {spaceId} = useParams<{spaceId: string}>();

  useEffect(() => {
    videoStore.fetchDashboardInformation(spaceId);
  }, [spaceId, videoStore]);

  const handleClose = () => {
    history.goBack();
    videoStore.resetModel();
  };

  return (
    <styled.Container>
      <DashboardVideo onClose={handleClose} videoUrl={videoStore.videoUrl} />
    </styled.Container>
  );
};

export default observer(VideoPage);
