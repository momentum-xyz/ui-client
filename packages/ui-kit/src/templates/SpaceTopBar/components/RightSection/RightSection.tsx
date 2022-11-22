import React, {FC} from 'react';
import {t} from 'i18next';

import {ToolbarIcon} from '../../../../molecules';
import {Separator} from '../../../../atoms';

import * as styled from './RightSection.styled';

interface PropsInterface {
  isAdmin?: boolean;
  adminLink?: string;
  baseLink?: string;
  spaceId: string;
  editSpaceHidden?: boolean;
  isSpaceFavorite?: boolean;
  isChatOpen?: boolean;
  showChatButton?: boolean;
  numberOfUnreadMessages?: number;
  toggleIsSpaceFavorite?: (spaceId: string) => void;
  toggleChat?: () => void;
}

const RightSection: FC<PropsInterface> = ({
  spaceId,
  editSpaceHidden,
  isAdmin,
  adminLink,
  baseLink,
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
            link={adminLink}
            isActive={(match, location) => {
              return !!adminLink && location.pathname.includes(adminLink);
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
      {toggleIsSpaceFavorite && (
        <ToolbarIcon
          title={t('tooltipTitles.favorite')}
          icon={isSpaceFavorite ? 'starOn' : 'star'}
          onClick={() => toggleIsSpaceFavorite(spaceId)}
          isWhite={false}
        />
      )}
      {(showChatButton || toggleIsSpaceFavorite) && <Separator />}
      <ToolbarIcon
        icon="fly-to"
        isWhite={false}
        title={t('tooltipTitles.flyAround')}
        link={baseLink}
      />
    </>
  );
};

export default RightSection;
