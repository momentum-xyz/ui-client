import React, {FC} from 'react';

import {PropsWithThemeInterface} from '../../interfaces';
import {PageTopBar} from '../../organisms';

import {RightSection} from './components';

interface PropsInterface extends PropsWithThemeInterface {
  title: string;
  subtitle?: string;
  isAdmin?: boolean;
  spaceId?: string;
  editSpaceHidden?: boolean;
  isSpaceFavorite?: boolean;
  isChatOpen?: boolean;
  toggleChat?: () => void;
  toggleIsSpaceFavorite?: (spaceId: string) => void;
  showChatButton?: boolean;
  numberOfUnreadMessages?: number;
  onLeave: () => void;
  adminLink?: string;
  baseLink?: string;
  children?: React.ReactNode;
}

const SpaceTopBar: FC<PropsInterface> = ({
  title,
  subtitle,
  spaceId,
  isSpaceFavorite,
  toggleIsSpaceFavorite,
  isChatOpen,
  isAdmin,
  editSpaceHidden,
  toggleChat,
  children,
  showChatButton,
  numberOfUnreadMessages,
  onLeave,
  adminLink,
  baseLink
}) => {
  return (
    <PageTopBar
      title={title}
      subtitle={subtitle}
      onClose={onLeave}
      actions={
        <>
          {!!spaceId && (
            <RightSection
              isChatOpen={isChatOpen}
              toggleChat={toggleChat}
              isAdmin={isAdmin}
              spaceId={spaceId}
              editSpaceHidden={editSpaceHidden}
              isSpaceFavorite={isSpaceFavorite}
              toggleIsSpaceFavorite={toggleIsSpaceFavorite}
              showChatButton={showChatButton}
              numberOfUnreadMessages={numberOfUnreadMessages}
              adminLink={adminLink}
              baseLink={baseLink}
            />
          )}
        </>
      }
    >
      {children}
    </PageTopBar>
  );
};

export default SpaceTopBar;
