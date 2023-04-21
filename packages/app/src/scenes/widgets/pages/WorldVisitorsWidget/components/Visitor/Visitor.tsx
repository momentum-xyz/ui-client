import {FC, memo, useState} from 'react';
import {signUpDateString, useI18n} from '@momentum-xyz/core';
import {ButtonEllipse, ButtonRound, Hexagon, ProfileLine} from '@momentum-xyz/ui-kit-storybook';

import {UserModelInterface} from 'core/models';
import {getImageAbsoluteUrl} from 'core/utils';

import * as styled from './Visitor.styled';

interface PropsInterface {
  user: UserModelInterface;
  onSendHighFive: (userId: string) => void;
  onInviteToVoiceChat: (userId: string) => void;
}

const Visitor: FC<PropsInterface> = ({user, onSendHighFive, onInviteToVoiceChat}) => {
  const [isDetailsShown, setIsDetailsShown] = useState<boolean>(false);

  const {t} = useI18n();

  return (
    <styled.Container data-testid="Visitor-test">
      <styled.Inner>
        <styled.Hexagon>
          <Hexagon
            type="third-borderless"
            imageSrc={getImageAbsoluteUrl(user.profile.avatarHash)}
            onClick={() => setIsDetailsShown(!isDetailsShown)}
          />
        </styled.Hexagon>

        <styled.TitleContainer>
          <styled.Title>{user.name}</styled.Title>
        </styled.TitleContainer>

        <styled.Actions>
          {!isDetailsShown && (
            <>
              <ButtonRound
                icon="voice_chat"
                variant="primary"
                onClick={() => onInviteToVoiceChat(user.id)}
              />
              <ButtonRound
                icon="high-five"
                variant="primary"
                onClick={() => onSendHighFive(user.id)}
              />
            </>
          )}
          <ButtonRound
            icon="info_2"
            variant="primary"
            isActive={isDetailsShown}
            onClick={() => setIsDetailsShown(!isDetailsShown)}
          />
        </styled.Actions>
      </styled.Inner>

      {isDetailsShown && (
        <styled.Details>
          {user.profile.bio && <styled.Bio>{user.profile.bio}</styled.Bio>}

          <styled.Line>
            <ProfileLine
              icon="astro"
              label={`${t('actions.joined')} ${signUpDateString(user.createdAt)}`}
            />
          </styled.Line>

          <styled.SubActions>
            <ButtonEllipse icon="voice_chat" label={t('labels.voiceChat')} />
            <ButtonEllipse icon="high-five" label={t('labels.highFive')} />
          </styled.SubActions>
        </styled.Details>
      )}
    </styled.Container>
  );
};

export default memo(Visitor);
