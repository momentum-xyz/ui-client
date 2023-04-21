import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {ButtonEllipse, Hexagon, ImageSizeEnum, Panel} from '@momentum-xyz/ui-kit-storybook';

import {UserModelInterface} from 'core/models';
import {getImageAbsoluteUrl} from 'core/utils';
import {ProfileImage, ProfileInfo} from 'ui-kit';

import * as styled from './OnlineUsersList.styled';

interface PropsInterface {
  onlineUsers: UserModelInterface[];
}

const OnlineUsersList: FC<PropsInterface> = ({onlineUsers}) => {
  const [activeUser, setActiveUser] = useState<UserModelInterface | null>(null);

  const {t} = useI18n();

  return (
    <styled.Container data-testid="OnlineUsersList-test">
      {onlineUsers.map((user) => (
        <Hexagon
          key={user.id}
          type="menu"
          isActive={user.id === activeUser?.id}
          imageSrc={getImageAbsoluteUrl(user.profile.avatarHash)}
          onClick={() => setActiveUser(user.id !== activeUser?.id ? user : null)}
        />
      ))}

      {!!activeUser && (
        <styled.ActiveUserContainer>
          <Panel
            size="small"
            icon="astronaut"
            variant="primary"
            image={getImageAbsoluteUrl(activeUser.profile.avatarHash, ImageSizeEnum.S3)}
            title={t('titles.profile')}
            onClose={() => setActiveUser(null)}
          >
            <styled.Wrapper>
              <ProfileImage
                name={activeUser.name}
                imageHeight={140}
                image={activeUser.profile.avatarHash}
                imageErrorIcon="astronaut"
              />

              <styled.Info>
                <ProfileInfo
                  description={activeUser.profile.bio}
                  address={activeUser.profile.profileLink}
                  joinDate={activeUser.createdAt}
                  hideBorder
                />
              </styled.Info>

              <styled.Actions>
                <ButtonEllipse icon="voice_chat" label={t('labels.voiceChat')} wide />
                <ButtonEllipse icon="high-five" label={t('labels.highFive')} wide />
              </styled.Actions>
            </styled.Wrapper>
          </Panel>
        </styled.ActiveUserContainer>
      )}
    </styled.Container>
  );
};

export default observer(OnlineUsersList);
