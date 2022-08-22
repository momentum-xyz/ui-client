import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {generatePath} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {Separator, ToolbarIcon} from 'ui-kit';

import * as styled from './RightSection.styled';

interface PropsInterface {
  isAdmin?: boolean;
  spaceId: string;
  editSpaceHidden?: boolean;
  isSpaceFavorite: boolean;
  isChatOpen?: boolean;
  isChat?: boolean;
  numberOfUnreadMessages?: number;
  toggleIsSpaceFavorite: (spaceId: string) => void;
  toggleChat?: () => void;
  onFlyAround: () => void;
}

const RightSection: FC<PropsInterface> = ({
  spaceId,
  editSpaceHidden,
  isAdmin,
  isSpaceFavorite,
  isChatOpen,
  isChat = true,
  numberOfUnreadMessages = 0,
  toggleIsSpaceFavorite,
  toggleChat,
  onFlyAround
}) => {
  return (
    <>
      {isAdmin && !editSpaceHidden && (
        <>
          <ToolbarIcon
            title={t('tooltipTitles.openAdmin')}
            icon="pencil"
            link={generatePath(ROUTES.spaceAdmin.base, {spaceId})}
            isActive={(match, location) => {
              return location.pathname.includes(generatePath(ROUTES.spaceAdmin.base, {spaceId}));
            }}
            state={{canGoBack: true}}
            isWhite={false}
            toolTipPlacement="bottom"
          />
          <Separator />
        </>
      )}
      {isChat && (
        <ToolbarIcon
          title={isChatOpen ? t('tooltipTitles.closeChat') : t('tooltipTitles.openChat')}
          icon="chat"
          onClick={toggleChat}
          isWhite={false}
        >
          {numberOfUnreadMessages > 0 && (
            <styled.MessageCount>{numberOfUnreadMessages}</styled.MessageCount>
          )}
        </ToolbarIcon>
      )}
      <ToolbarIcon
        title={t('tooltipTitles.favorite')}
        icon={isSpaceFavorite ? 'starOn' : 'star'}
        onClick={() => toggleIsSpaceFavorite(spaceId)}
        isWhite={false}
      />
      <Separator />
      <ToolbarIcon
        icon="fly-to"
        isWhite={false}
        title={t('tooltipTitles.flyAround')}
        onClick={onFlyAround}
      />
    </>
  );
};

export default observer(RightSection);
