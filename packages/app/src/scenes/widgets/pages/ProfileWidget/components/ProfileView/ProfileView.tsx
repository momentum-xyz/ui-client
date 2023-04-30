import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Image, Frame, ProfileLine, WalletHash} from '@momentum-xyz/ui-kit-storybook';
import {absoluteLink, withoutProtocol, useI18n, signUpDateString} from '@momentum-xyz/core';

import {WorldsOwnedList, WorldsStakedList} from 'ui-kit';
import {UserModelInterface, WorldInfoModelInterface} from 'core/models';

import * as styled from './ProfileView.styled';

interface PropsInterface {
  user: UserModelInterface;
  defaultWalletId: string;
  worldsOwnedList: WorldInfoModelInterface[];
  worldsStakedList: WorldInfoModelInterface[];
  onInfoWorld: (uuid: string) => void;
  onVisitWorld: (uuid: string) => void;
}

const ProfileView: FC<PropsInterface> = ({
  user,
  defaultWalletId,
  worldsOwnedList,
  worldsStakedList,
  onInfoWorld,
  onVisitWorld
}) => {
  const {t} = useI18n();

  return (
    <styled.Container>
      <Frame>
        <Image src={user.avatarLargeSrc} height={200} />
        <styled.NameContainer>{user.name}</styled.NameContainer>

        <styled.ScrollableContainer>
          <styled.GeneralInfo>
            {user.profile?.bio && <div>{user.profile?.bio}</div>}
            {user.profile.profileLink && (
              <ProfileLine
                icon="link"
                label={
                  <styled.LinkAccent target="_blank" href={absoluteLink(user.profile.profileLink)}>
                    {withoutProtocol(user.profile.profileLink)}
                  </styled.LinkAccent>
                }
              />
            )}
            <ProfileLine
              icon="astro"
              label={`${t('actions.joined')} ${signUpDateString(user.createdAt)}`}
            />
            <WalletHash icon="talisman" hash={defaultWalletId || ''} />
          </styled.GeneralInfo>

          <WorldsOwnedList
            worldsOwned={worldsOwnedList}
            onSelectWorld={onInfoWorld}
            onVisitWorld={onVisitWorld}
          />

          <WorldsStakedList
            worldsStakedIn={worldsStakedList}
            onSelectWorld={onInfoWorld}
            onVisitWorld={onVisitWorld}
          />
        </styled.ScrollableContainer>
      </Frame>
    </styled.Container>
  );
};

export default observer(ProfileView);
