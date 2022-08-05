import React, {useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useParams} from 'react-router-dom';
import {useHistory} from 'react-router';

import {useStore} from 'shared/hooks';

import {DashboardVideo} from './components/templates/DashboardVideo';
import * as styled from './VideoPage.styled';

const VideoPage: React.FC = () => {
  const {videoStore} = useStore();

  const history = useHistory();

  const {spaceId} = useParams<{spaceId: string}>();

  useEffect(() => {
    videoStore.fetchYoutubeHash(spaceId);
  }, [spaceId, videoStore]);

  const handleClose = () => {
    history.goBack();
    videoStore.resetModel();
  };

  return (
    <styled.Container>
      <DashboardVideo onClose={handleClose} youtubeHash={videoStore.youtubeHash} />
    </styled.Container>
  );
};

export default observer(VideoPage);
