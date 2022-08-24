import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import YouTube from 'react-youtube';

import * as styled from './VideoPanel.styled';

interface PropsInterface {
  youtubeHash?: string;
}

const VideoPanel: FC<PropsInterface> = ({youtubeHash}) => {
  const youtubeOptions = {
    playerVars: {
      autoplay: 1,
      mute: 0
    }
  };
  return (
    <styled.Wrapper data-testid="VideoPanel-test">
      <YouTube
        videoId={youtubeHash}
        className="youtube"
        iframeClassName="youtubeIframe"
        opts={youtubeOptions}
      />
    </styled.Wrapper>
  );
};

export default observer(VideoPanel);
