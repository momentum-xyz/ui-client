import {FC, memo, useState} from 'react';
import {signUpDateString, useI18n} from '@momentum-xyz/core';
import {ButtonEllipse, ButtonRound, Hexagon, ProfileLine} from '@momentum-xyz/ui-kit-storybook';

import {UserDetailsModelType} from 'core/models';
import {getImageAbsoluteUrl} from 'core/utils';

import * as styled from './Visitor.styled';

interface PropsInterface {
  userDetails: UserDetailsModelType;
  onVisitWorld: (worldId: string) => void;
  onSendHighFive: (userId: string) => void;
  onInviteToVoiceChat: (userId: string) => void;
}

const Visitor: FC<PropsInterface> = ({
  userDetails,
  onVisitWorld,
  onSendHighFive,
  onInviteToVoiceChat
}) => {
  const [isDetailsShown, setIsDetailsShown] = useState<boolean>(false);
  const {user} = userDetails;

  const {t} = useI18n();

  if (!user) {
    return <></>;
  }

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
                onClick={() => onInviteToVoiceChat(userDetails.userId)}
              />
              <ButtonRound
                icon="high-five"
                variant="primary"
                onClick={() => onSendHighFive(userDetails.userId)}
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

          {userDetails.worldsOwned.map(({id, name}) => (
            <styled.Line key={id}>
              <ProfileLine
                icon="rabbit_fill"
                label={<styled.Link onClick={() => onVisitWorld(id)}>{name}</styled.Link>}
              />
            </styled.Line>
          ))}

          <styled.Line>
            <ProfileLine
              icon="astro"
              label={`${t('actions.joined')} ${signUpDateString(user.createdAt)}`}
            />
          </styled.Line>

          <styled.SubActions>
            <ButtonEllipse
              icon="voice_chat"
              label={t('labels.voiceChat')}
              onClick={() => onInviteToVoiceChat(userDetails.userId)}
            />
            <ButtonEllipse
              icon="high-five"
              label={t('labels.highFive')}
              onClick={() => onSendHighFive(userDetails.userId)}
            />
          </styled.SubActions>
        </styled.Details>
      )}
    </styled.Container>
  );
};

export default memo(Visitor);
