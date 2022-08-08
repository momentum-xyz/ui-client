import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {appVariables} from 'api/constants';
import {Text, PropsWithThemeInterface} from 'ui-kit/index';
import image from 'ui-kit/assets/images/common/flamingo.svg';

import * as styled from './UnityLoader.styled';

const MESSAGE_TIMEOUT_MS = 5000;

const UnityLoader: React.FC<PropsWithThemeInterface> = ({theme}) => {
  const [messageShown, setMessageShown] = useState<boolean>(false);

  const {t} = useTranslation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMessageShown(true);
    }, MESSAGE_TIMEOUT_MS);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <styled.Inner>
      <styled.Wrapper>
        <styled.Image src={image} />
        <Text theme={theme} text={t('messages.loading')} size="s" />
        <Text theme={theme} text={t('messages.onlineArena')} size="s" />

        <styled.Version>
          <Text
            size="s"
            theme={theme}
            text={t('messages.version', {version: appVariables.APP_VERSION})}
          />
        </styled.Version>
      </styled.Wrapper>

      {messageShown && (
        <styled.MessageWrapper>
          <styled.Message>
            <span>{t('messages.loading30sec')}</span>
            <styled.Link target="_blank" href={appVariables.WIKI_URL}>
              {t('messages.clearCache')}
            </styled.Link>
            .
          </styled.Message>
        </styled.MessageWrapper>
      )}
    </styled.Inner>
  );
};

export default UnityLoader;
