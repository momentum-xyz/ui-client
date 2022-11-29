import {observer} from 'mobx-react-lite';
import {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {useAuth} from 'react-oidc-context';
import {Avatar, ToolbarIcon, IconSvg, ToolbarIconList, Text, Dialog} from '@momentum-xyz/ui-kit';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import * as styled from './SimpleProfileMenu.styled';

const MENU_OFFSET_BOTTOM = 60;

const SimpleProfileMenu: FC = () => {
  const {widgetsStore, sessionStore} = useStore();
  const {profileMenuStore} = widgetsStore;
  const {user} = sessionStore;

  const auth = useAuth();

  const signOutUser = async () => {
    await sessionStore.logout(auth);
    document.location.href = ROUTES.worldBuilder.base;
  };

  const {t} = useTranslation();

  return (
    <>
      {profileMenuStore.profileMenuDialog.isOpen && (
        <Dialog
          position="rightBottom"
          title=""
          offset={{bottom: MENU_OFFSET_BOTTOM}}
          onClose={profileMenuStore.profileMenuDialog.close}
          isBodyExtendingToEdges
          showBackground={false}
        >
          <styled.Container data-testid="SimpleProfileMenu-test">
            <styled.Option onClick={signOutUser}>
              <styled.IconContainer>
                <IconSvg name="logout" size="medium-large" isWhite />
              </styled.IconContainer>
              <Text text={t('labels.logout')} size="xxs" />
            </styled.Option>
          </styled.Container>
        </Dialog>
      )}
      <styled.Footer>
        <ToolbarIconList>
          {user?.profile && (
            <ToolbarIcon title={t('titles.profile')} onClick={profileMenuStore.openProfileMenu}>
              <Avatar
                size="extra-small"
                status={user?.status}
                avatarSrc={user.avatarSrc}
                showBorder
                showHover
              />
            </ToolbarIcon>
          )}
        </ToolbarIconList>
      </styled.Footer>
    </>
  );
};

export default observer(SimpleProfileMenu);
