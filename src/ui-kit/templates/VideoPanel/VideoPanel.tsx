import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import YouTube from 'react-youtube';
import cn from 'classnames';

import * as styled from './VideoPanel.styled';

interface PropsInterface {
  youtubeHash?: string;
  onWidget?: boolean;
}

const VideoPanel: FC<PropsInterface> = ({youtubeHash, onWidget}) => {
  const youtubeOptions = {
    playerVars: {
      autoplay: 1,
      mute: 0
    }
  };

  return (
    <styled.Container data-testid="VideoPanel-test" className={cn(onWidget && 'onWidget')}>
      <YouTube
        videoId={youtubeHash}
        className="youtube"
        iframeClassName="youtubeIframe"
        opts={youtubeOptions}
      />
    </styled.Container>
  );
};

export default observer(VideoPanel);
