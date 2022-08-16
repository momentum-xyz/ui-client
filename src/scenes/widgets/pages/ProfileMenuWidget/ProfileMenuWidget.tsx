import React, {FC} from 'react';
import {useAuth} from 'react-oidc-context';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {Avatar, Dialog, IconSvg, Text, Toggle} from 'ui-kit';
import {appVariables} from 'api/constants';
import {UserStatusEnum} from 'core/enums';

import * as styled from './ProfileMenuWidget.styled';
import {Setting} from './components';

const MENU_OFFSET_RIGHT = 175;
const MENU_OFFSET_BOTTOM = 60;

const SETTING_OFFSET_RIGHT = 20;
const SETTING_OFFSET_BOTTOM = 60;

const ProfileMenuWidget: FC = () => {
  const {widgetStore, sessionStore} = useStore();
  const {profile} = sessionStore;
  const {profileMenuStore, tokenRulesStore} = widgetStore;

  const auth = useAuth();

  const {t} = useTranslation();

  const signOutUser = async () => {
    await sessionStore.logout(auth);
    document.location.href = ROUTES.base;
  };

  const handleProfileOpen = () => {
    profileMenuStore.profileDialog.open();
    profileMenuStore.profileMenuDialog.close();
  };

  const openSettings = () => {
    profileMenuStore.openSetting();
  };

  const handleTokenRulesOpen = () => {
    tokenRulesStore.widgetDialog.open();
    profileMenuStore.profileMenuDialog.close();
  };

  const handleChangeStatus = (checked: boolean) => {
    sessionStore.changeStatus(checked ? UserStatusEnum.ONLINE : UserStatusEnum.DO_NOT_DISTURB);
  };

  if (!profile?.profile) {
    return null;
  }

  return (
    <Dialog
      position="rightBottom"
      headerStyle={profileMenuStore.isSetting ? 'normal' : undefined}
      title={profileMenuStore.isSetting ? t('labels.settings') : ''}
      offset={
        profileMenuStore.isSetting
          ? {right: SETTING_OFFSET_RIGHT, bottom: SETTING_OFFSET_BOTTOM}
          : {right: MENU_OFFSET_RIGHT, bottom: MENU_OFFSET_BOTTOM}
      }
      onClose={
        profileMenuStore.isSetting
          ? profileMenuStore.closeSetting
          : profileMenuStore.profileMenuDialog.close
      }
      isBodyExtendingToEdges
      showBackground={false}
      showCloseButton={profileMenuStore.isSetting}
    >
      {profileMenuStore.isSetting ? (
        <Setting />
      ) : (
        <styled.Container data-testid="ProfileMenuWidget-test">
          <styled.Option onClick={handleProfileOpen}>
            <styled.IconContainer>
              <Avatar
                avatarSrc={`${appVariables.RENDER_SERVICE_URL}/get/${
                  profile.profile.avatarHash as string
                }`}
                size="super-small"
                showBorder
              />
            </styled.IconContainer>
            <Text text={profile.name} size="xxs" isMultiline={false} />
          </styled.Option>
          <styled.Option
            onClick={() => handleChangeStatus(profile.status !== UserStatusEnum.ONLINE)}
          >
            <Toggle
              size="small"
              variant="availability"
              checked={profile.status === UserStatusEnum.ONLINE}
              onChange={handleChangeStatus}
            />
            <Text text={profile.status ? t(`labels.${profile.status}`) : ''} size="xxs" />
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
      )}
    </Dialog>
  );
};

export default observer(ProfileMenuWidget);
