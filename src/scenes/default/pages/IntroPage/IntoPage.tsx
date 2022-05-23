import React, {FC, useCallback, useEffect} from 'react';
import {useHistory} from 'react-router';
import {useTranslation} from 'react-i18next';
import YouTube from 'react-youtube';

import {cookie} from 'core/services';
import {CookieKeyEnum} from 'core/enums';
import {SvgButton, Text} from 'ui-kit';
import {ROUTES} from 'core/constants';

import * as styled from './IntoPage.styled';

// FIXME: Move to constants
const YOUTUBE_INTRO_VIDEO_ID = '0ZctdA2SxKk';

const IntoPage: FC = () => {
  const history = useHistory();
  const {t} = useTranslation();

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
      mute: 0
    }
  };

  return (
    <styled.Background>
      <styled.Header>
        <Text text={t('messages.welcome')} size="l" weight="normal" align="left" />
        <SvgButton iconName="close" size="medium-large" isWhite onClick={closeHandler} />
      </styled.Header>
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
