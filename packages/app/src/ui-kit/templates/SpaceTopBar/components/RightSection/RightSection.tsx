import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {generatePath} from 'react-router-dom';
import {Separator, ToolbarIcon} from '@momentum-xyz/ui-kit';

import {ROUTES} from 'core/constants';

import * as styled from './RightSection.styled';

interface PropsInterface {
  isAdmin?: boolean;
  spaceId: string;
  editSpaceHidden?: boolean;
  isSpaceFavorite: boolean;
  isChatOpen?: boolean;
  showChatButton?: boolean;
  numberOfUnreadMessages?: number;
  toggleIsSpaceFavorite: (spaceId: string) => void;
  toggleChat?: () => void;
}

const RightSection: FC<PropsInterface> = ({
  spaceId,
  editSpaceHidden,
  isAdmin,
  isSpaceFavorite,
  isChatOpen,
  showChatButton = true,
  numberOfUnreadMessages = 0,
  toggleIsSpaceFavorite,
  toggleChat
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
      {showChatButton && (
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
        link={generatePath(ROUTES.base, {spaceId})}
      />
    </>
  );
};

export default observer(RightSection);
