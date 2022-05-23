import React, {FC, useCallback, useEffect} from 'react';
import {useHistory} from 'react-router';
import YouTube from 'react-youtube';

import {cookie} from 'core/services';
import {CookieKeyEnum} from 'core/enums';
import {SvgButton} from 'ui-kit';
import {ROUTES} from 'core/constants';
import background from 'static/images/bg.png';

import * as styled from './IntoPage.styled';

// FIXME: Move to constants
const YOUTUBE_INTRO_VIDEO_ID = '0ZctdA2SxKk';

const IntoPage: FC = () => {
  const history = useHistory();

  useEffect(() => {
    if (!cookie.has(CookieKeyEnum.INTRO)) {
      cookie.create(CookieKeyEnum.INTRO, '1');
    }
  }, []);

  const closeHandler = useCallback(() => {
    history.push(ROUTES.base);
  }, [history]);

  const opts = {
    playerVars: {
      autoplay: 0,
      mute: 0,
      controls: 0
    }
  };

  return (
    <styled.Background background={background}>
      <styled.CloseIcon>
        <SvgButton iconName="close" size="medium-large" isWhite onClick={closeHandler} />
      </styled.CloseIcon>
      <YouTube
        videoId={YOUTUBE_INTRO_VIDEO_ID}
        onEnd={closeHandler}
        className="youtube"
        iframeClassName="youtubeIframe"
        opts={opts}
      />
    </styled.Background>
  );
};

export default IntoPage;
