import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Image, Frame, ProfileLine, WalletHash} from '@momentum-xyz/ui-kit-storybook';
import {absoluteLink, withoutProtocol, useI18n, signUpDateString} from '@momentum-xyz/core';
//import {toast} from 'react-toastify';

import {
  //TOAST_GROUND_OPTIONS,
  //TOAST_NOT_AUTO_CLOSE_OPTIONS,
  //ToastContent,
  WorldsOwnedList,
  WorldsStakedList
} from 'ui-kit';
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

  // FIXME: Removal after testing alerts
  /*const showToast = () => {
    toast.info(
      <ToastContent
        icon="stake"
        title={t('titles.alert')}
        text="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes"
        approveInfo={{
          title: 'Yes',
          onClick: () => {}
        }}
        declineInfo={{
          title: 'No',
          onClick: () => {}
        }}
        showCloseButton
      />,
      TOAST_NOT_AUTO_CLOSE_OPTIONS
    );
  };*/

  return (
    <styled.Container>
      <Frame>
        <Image src={user.avatarLargeSrc} height={200} />
        <styled.NameContainer>{user.name}</styled.NameContainer>

        {/*<button onClick={showToast}>TOAST</button>*/}

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
