import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import YouTube from 'react-youtube';

import {useStore} from 'shared/hooks';

import * as styled from './VideoPanel.styled';

const VideoPanel: FC = () => {
  const {spaceAdminStore} = useStore();
  const {broadcastStore} = spaceAdminStore;

  return (
    <styled.Wrapper data-testid="VideoPanel-test">
      <YouTube
        videoId={broadcastStore.broadcast.url}
        className="youtube"
        iframeClassName="youtubeIframe"
        opts={broadcastStore.opts}
      />
    </styled.Wrapper>
  );
};

export default observer(VideoPanel);
