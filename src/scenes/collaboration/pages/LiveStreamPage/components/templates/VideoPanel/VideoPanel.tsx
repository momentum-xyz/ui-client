import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import YouTube from 'react-youtube';

import {useStore} from 'shared/hooks';

import * as styled from './VideoPanel.styled';

const VideoPanel: FC = () => {
  const {spaceAdminStore} = useStore();
  const {broadcastStore} = spaceAdminStore;

  const opts = {
    playerVars: {
      autoplay: 1,
      mute: 0
    }
  };

  return (
    <styled.Wrapper data-testid="VideoPanel-test">
      <YouTube
        videoId={broadcastStore.youtubeHash}
        className="youtube"
        iframeClassName="youtubeIframe"
        opts={opts}
      />
    </styled.Wrapper>
  );
};

export default observer(VideoPanel);
