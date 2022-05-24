import React, {FC, useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'styled-components';
import YouTube from 'react-youtube';

import {cookie} from 'core/services';
import {CookieKeyEnum} from 'core/enums';
import {Button, SvgButton} from 'ui-kit';
import {ROUTES} from 'core/constants';
import background from 'static/images/bg.png';

import * as styled from './IntoPage.styled';

// FIXME: Move to constants
const YOUTUBE_INTRO_VIDEO_ID = '05StN46VZtw';

const IntoPage: FC = () => {
  const [messageShown, setMessageShown] = useState<boolean>(true);

  const history = useHistory();
  const {t} = useTranslation();
  const theme = useTheme();

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
    <styled.Background background={background}>
      <styled.Wrapper>
        <styled.MessageWrapper>
          <styled.Message>{t('messages.loginSuccessful')}</styled.Message>
        </styled.MessageWrapper>

        <styled.CloseButton>
          <SvgButton
            iconName="close"
            size="medium-large"
            isWhite
            onClick={closeHandler}
            theme={theme}
          />
        </styled.CloseButton>

        <YouTube
          videoId={YOUTUBE_INTRO_VIDEO_ID}
          onPlay={() => setMessageShown(false)}
          onEnd={closeHandler}
          className="youtube"
          iframeClassName="youtubeIframe"
          opts={opts}
        />

        {messageShown && <styled.PlayMessage>{t('messages.playFriggin')}</styled.PlayMessage>}

        <styled.ContinueButton>
          <Button
            variant="primary"
            theme={theme}
            label={t('actions.closeAndContinue')}
            onClick={closeHandler}
          />
        </styled.ContinueButton>
      </styled.Wrapper>
    </styled.Background>
  );
};

export default IntoPage;
