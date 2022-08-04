import React, {FC} from 'react';
import YouTube from 'react-youtube';
import {useTheme} from 'styled-components';
import {observer} from 'mobx-react-lite';

import {SvgButton} from 'ui-kit';

import * as styled from './DashboardVideo.styled';

interface PropsInterface {
  onClose: () => void;
  videoUrl: string;
}

const DashboardVideo: FC<PropsInterface> = ({onClose, videoUrl}) => {
  const theme = useTheme();

  const opts = {
    playerVars: {
      autoplay: 1,
      mute: 0
    }
  };

  return (
    <styled.Container>
      <styled.Wrapper>
        <styled.CloseButton>
          <SvgButton iconName="close" size="medium-large" isWhite onClick={onClose} theme={theme} />
        </styled.CloseButton>
        <YouTube
          videoId={videoUrl}
          onEnd={onClose}
          className="youtube"
          iframeClassName="youtubeIframe"
          opts={opts}
        />
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(DashboardVideo);
