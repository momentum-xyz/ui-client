import React, {FC} from 'react';
import {t} from 'i18next';
import {useAuth} from 'react-oidc-context';

import {useStore} from 'shared/hooks';
import {Avatar, Dialog, IconSvg, Text} from 'ui-kit';
import {endpoints} from 'api/constants';

import * as styled from './ProfileMenuWidget.styled';

const DIALOG_OFFSET_RIGHT = 175;
const DIALOG_OFFSET_BOTTOM = 60;

const ProfileMenuWidget: FC = () => {
  const {widgetStore, sessionStore} = useStore();
  const {profile} = sessionStore;
  const {profileMenuStore, settingsStore, tokenRulesStore} = widgetStore;

  const auth = useAuth();

  // @ts-ignore
  const signOutUser = (e) => {
    e.preventDefault();
    sessionStore.logout(auth);
  };

  const handleProfileOpen = () => {
    profileMenuStore.profileDialog.open();
    profileMenuStore.profileMenuDialog.close();
  };

  const openSettings = () => {
    settingsStore.dialog.open();
    profileMenuStore.profileMenuDialog.close();
  };

  const handleTokenRulesOpen = () => {
    tokenRulesStore.widgetDialog.open();
    profileMenuStore.profileMenuDialog.close();
  };

  if (!profile?.profile) return null;

  return (
    <Dialog
      position="rightBottom"
      offset={{right: DIALOG_OFFSET_RIGHT, bottom: DIALOG_OFFSET_BOTTOM}}
      onClose={profileMenuStore.profileMenuDialog.close}
      isBodyExtendingToEdges
      showBackground={false}
    >
      <styled.Container>
        <styled.Option onClick={handleProfileOpen}>
          <styled.IconContainer>
            <Avatar
              avatarSrc={`${endpoints.renderService}/get/${profile.profile.avatarHash as string}`}
              size="super-small"
              showBorder
            />
          </styled.IconContainer>
          <Text text={profile.name} size="xxs" />
        </styled.Option>
        {profile.isNodeAdmin && (
          <styled.Option onClick={handleTokenRulesOpen}>
            <styled.IconContainer>
              <IconSvg name="whitelist" size="medium-large" isWhite />
            </styled.IconContainer>
            <Text text={t('labels.tokenRules')} size="xxs" />
          </styled.Option>
        )}
        <styled.Option onClick={openSettings}>
          <styled.IconContainer>
            <IconSvg name="gear" size="medium-large" isWhite />
          </styled.IconContainer>
          <Text text={t('labels.settings')} size="xxs" />
        </styled.Option>
        <styled.Option onClick={signOutUser}>
          <styled.IconContainer>
            <IconSvg name="logout" size="medium-large" isWhite />
          </styled.IconContainer>
          <Text text={t('labels.logout')} size="xxs" />
        </styled.Option>
      </styled.Container>
    </Dialog>
  );
};

export default ProfileMenuWidget;
