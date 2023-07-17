import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Image, Frame, ProfileLine, WalletHash, TextCut} from '@momentum-xyz/ui-kit';
import {absoluteLink, withoutProtocol, useI18n, signUpDateString} from '@momentum-xyz/core';

import {WalletInterface} from 'api';
import {WorldsOwnedList, WorldsStakedList} from 'ui-kit';
import {UserModelInterface, WorldInfoModelInterface} from 'core/models';

import * as styled from './ProfileView.styled';

interface PropsInterface {
  user: UserModelInterface;
  wallet: WalletInterface | undefined;
  worldsOwnedList: WorldInfoModelInterface[];
  worldsStakedList: WorldInfoModelInterface[];
  onInfoWorld: (uuid: string) => void;
  onVisitWorld: (uuid: string) => void;
}

const ProfileView: FC<PropsInterface> = ({
  user,
  wallet,
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

        <styled.GeneralInfo>
          {user.profile?.bio && <TextCut text={user.profile?.bio} />}
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

          {wallet && <WalletHash icon={wallet.wallet_icon} hash={wallet.wallet_id} />}
        </styled.GeneralInfo>
      </Frame>

      <styled.Worlds>
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
      </styled.Worlds>
    </styled.Container>
  );
};

export default observer(ProfileView);
