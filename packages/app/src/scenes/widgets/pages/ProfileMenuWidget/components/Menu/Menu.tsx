import React, {FC, useRef} from 'react';
import {useAuth} from 'react-oidc-context';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {Avatar, Dialog, IconSvg, Text, Toggle, useClickOutside} from '@momentum-xyz/ui-kit';
import {UserStatusEnum} from '@momentum-xyz/core';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import * as styled from './Menu.styled';

const MENU_OFFSET_RIGHT = 175;
const MENU_OFFSET_BOTTOM = 60;

const Menu: FC = () => {
  const {widgetStore, sessionStore} = useStore();
  const {user} = sessionStore;
  const {profileMenuStore} = widgetStore;

  const MenuRef = useRef<HTMLDivElement>(null);

  const auth = useAuth();

  const {t} = useTranslation();

  const signOutUser = async () => {
    await sessionStore.logout(auth);
    document.location.href = ROUTES.base;
  };

  useClickOutside(MenuRef, () => {
    handleCloseMenu();
  });

  const handleProfileOpen = () => {
    profileMenuStore.profileDialog.open();
    handleCloseMenu();
  };

  const handleOpenSettings = () => {
    profileMenuStore.menuDialog.close();
    profileMenuStore.settingDialog.open();
  };

  const handleTokenRulesOpen = () => {
    profileMenuStore.menuDialog.close();
    profileMenuStore.tokenRulesDialog.open();
  };

  const handleChangeStatus = (checked: boolean) => {
    sessionStore.changeStatus(checked ? UserStatusEnum.ONLINE : UserStatusEnum.DO_NOT_DISTURB);
  };

  const handleCloseMenu = () => {
    profileMenuStore.menuDialog.close();
    profileMenuStore.profileMenuDialog.close();
  };

  if (!user?.profile) {
    return null;
  }

  return (
    <Dialog
      position="rightBottom"
      title=""
      offset={{right: MENU_OFFSET_RIGHT, bottom: MENU_OFFSET_BOTTOM}}
      onClose={handleCloseMenu}
      isBodyExtendingToEdges
      showBackground={false}
    >
      <styled.Container ref={MenuRef} data-testid="Menu-test">
        <>
          <styled.Option onClick={handleProfileOpen}>
            <styled.IconContainer>
              <Avatar avatarSrc={user?.avatarSrc} size="super-small" showBorder />
            </styled.IconContainer>
            <Text text={user.name} size="xxs" isMultiline={false} />
          </styled.Option>
          <styled.Option onClick={() => handleChangeStatus(user.status !== UserStatusEnum.ONLINE)}>
            <Toggle
              size="small"
              variant="availability"
              checked={user.status === UserStatusEnum.ONLINE}
              onChange={handleChangeStatus}
            />
            <Text text={user.status ? t(`labels.${user.status}`) : ''} size="xxs" />
          </styled.Option>
          {user.isNodeAdmin && (
            <styled.Option onClick={handleTokenRulesOpen}>
              <styled.IconContainer>
                <IconSvg name="whitelist" size="medium-large" isWhite />
              </styled.IconContainer>
              <Text text={t('labels.tokenRules')} size="xxs" />
            </styled.Option>
          )}
          <styled.Option onClick={handleOpenSettings}>
            <styled.IconContainer>
              <IconSvg name="gear" size="medium-large" isWhite />
            </styled.IconContainer>
            <Text text={t('labels.settings')} size="xxs" />
          </styled.Option>
        </>
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

export default observer(Menu);
