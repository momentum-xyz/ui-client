import React, {useEffect, useState} from 'react';
import {useI18n} from '@momentum-xyz/core';
import {PropsWithThemeInterface, Text} from '@momentum-xyz/ui-kit';
import cn from 'classnames';

import {appVariables} from 'api/constants';
import rabbit1 from 'static/images/rabbit-1.svg';
import rabbit2 from 'static/images/rabbit-2.svg';
import rabbit3 from 'static/images/rabbit-3.svg';
import rabbit4 from 'static/images/rabbit-4.svg';
import rabbit5 from 'static/images/rabbit-5.svg';
import rabbit6 from 'static/images/rabbit-6.svg';

import * as styled from './UnityLoader.styled';

const MESSAGE_TIMEOUT_MS = 5000;

const UnityLoader: React.FC<PropsWithThemeInterface> = ({theme}) => {
  const [messageShown, setMessageShown] = useState<boolean>(false);
  const [firstAnimation, setFirstAnimation] = useState(true);
  const [secondAnimation, setSecondAnimation] = useState(false);
  const [thirdAnimation, setThirdAnimation] = useState(false);
  const [fourthAnimation, setFourthAnimation] = useState(false);
  const [fifthAnimation, setFifthAnimation] = useState(false);
  const [sixthAnimation, setSixthAnimation] = useState(false);

  const {t} = useI18n();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMessageShown(true);
    }, MESSAGE_TIMEOUT_MS);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <styled.Inner data-testid="UnityLoader-test">
      <styled.Wrapper>
        <styled.RabbitWrapper>
          <styled.FirstRabbit
            className={cn(firstAnimation && 'rabbit')}
            onAnimationEnd={() => {
              setFirstAnimation(false);
              setSecondAnimation(true);
            }}
            src={rabbit2}
          />
          {secondAnimation ? (
            <styled.SecondRabbit
              onAnimationEnd={() => {
                setSecondAnimation(false);
                setThirdAnimation(true);
              }}
              className={cn(secondAnimation && 'rabbit2')}
              src={rabbit3}
            />
          ) : (
            <styled.SixthRabbit
              onAnimationEnd={() => {
                setFirstAnimation(true);
                setSixthAnimation(false);
              }}
              className={cn(sixthAnimation && 'rabbit6')}
              src={rabbit6}
            />
          )}
          {thirdAnimation ? (
            <styled.ThirdRabbit
              onAnimationEnd={() => {
                setThirdAnimation(false);
                setFourthAnimation(true);
              }}
              className={cn(thirdAnimation && 'rabbit3')}
              src={rabbit4}
            />
          ) : (
            <styled.FifthRabbit
              onAnimationEnd={() => {
                setFifthAnimation(false);
                setSixthAnimation(true);
              }}
              className={cn(fifthAnimation && 'rabbit5')}
              src={rabbit5}
            />
          )}
          <styled.FourthRabbit
            onAnimationEnd={() => {
              setFourthAnimation(false);
              setFifthAnimation(true);
            }}
            className={cn(fourthAnimation && 'rabbit4')}
            src={rabbit1}
          />
        </styled.RabbitWrapper>
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
            <styled.Link target="_blank" href={appVariables.DISCORD_URL}>
              {t('messages.joinUsOnDiscord')}
            </styled.Link>
            .
          </styled.Message>
        </styled.MessageWrapper>
      )}
    </styled.Inner>
  );
};

export default UnityLoader;
