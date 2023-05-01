import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {
  ButtonEllipse,
  Hexagon,
  ImageSizeEnum,
  Panel,
  ProfileLine
} from '@momentum-xyz/ui-kit-storybook';

import {UserDetailsModelType} from 'core/models';
import {getImageAbsoluteUrl} from 'core/utils';
import {ProfileImage, ProfileInfo} from 'ui-kit';

import * as styled from './OnlineUsersList.styled';

interface PropsInterface {
  onlineUsers: UserDetailsModelType[];
  voiceChatUsers: string[];
  onVisitWorld: (worldId: string) => void;
  onInviteToVoiceChat: (userId: string) => void;
  onSendHighFive: (userId: string) => void;
}

const OnlineUsersList: FC<PropsInterface> = ({
  onlineUsers,
  voiceChatUsers,
  onVisitWorld,
  //onInviteToVoiceChat,
  onSendHighFive
}) => {
  const [activeUser, setActiveUser] = useState<UserDetailsModelType | null>(null);

  const {t} = useI18n();

  return (
    <styled.Container data-testid="OnlineUsersList-test">
      {onlineUsers.map((userDetails) => (
        <Hexagon
          key={userDetails.userId}
          type="menu"
          isActive={userDetails.userId === activeUser?.userId}
          indicator={voiceChatUsers.includes(userDetails.userId) ? 'voice' : undefined}
          imageSrc={getImageAbsoluteUrl(userDetails.user?.profile.avatarHash)}
          onClick={() =>
            setActiveUser(userDetails.userId !== activeUser?.userId ? userDetails : null)
          }
        />
      ))}

      {!!activeUser && (
        <styled.ActiveUserContainer>
          <Panel
            size="small"
            icon="astronaut"
            variant="primary"
            image={getImageAbsoluteUrl(activeUser.user?.profile.avatarHash, ImageSizeEnum.S3)}
            title={t('titles.profile')}
            onClose={() => setActiveUser(null)}
          >
            <styled.Wrapper>
              <ProfileImage
                name={activeUser.user?.name || ''}
                imageHeight={140}
                image={activeUser.user?.profile.avatarHash}
                imageErrorIcon="astronaut"
              />

              <styled.Info>
                <ProfileInfo
                  description={activeUser.user?.profile.bio}
                  weblink={activeUser.user?.profile.profileLink}
                  joinDate={activeUser.user?.createdAt}
                  hideBorder
                />

                {activeUser.worldsOwned.map(({id, name}) => (
                  <ProfileLine
                    key={id}
                    icon="rabbit_fill"
                    label={<styled.Link onClick={() => onVisitWorld(id)}>{name}</styled.Link>}
                  />
                ))}
              </styled.Info>

              <styled.Actions>
                {/*<ButtonEllipse
                  icon="voice_chat"
                  label={t('labels.voiceChat')}
                  wide
                  onClick={() => onInviteToVoiceChat(activeUser.userId)}
                />*/}
                <ButtonEllipse
                  icon="high-five"
                  label={t('labels.highFive')}
                  wide
                  onClick={() => onSendHighFive(activeUser.userId)}
                />
              </styled.Actions>
            </styled.Wrapper>
          </Panel>
        </styled.ActiveUserContainer>
      )}
    </styled.Container>
  );
};

export default observer(OnlineUsersList);
