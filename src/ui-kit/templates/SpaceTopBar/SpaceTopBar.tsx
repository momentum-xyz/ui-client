import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {PageTopBar} from 'ui-kit';
import {PropsWithThemeInterface} from 'ui-kit/interfaces';

import {RightSection} from './components';

interface PropsInterface extends PropsWithThemeInterface {
  title: string;
  subtitle?: string;
  isAdmin?: boolean;
  spaceId?: string;
  editSpaceHidden?: boolean;
  isSpaceFavorite: boolean;
  isChatOpen?: boolean;
  toggleChat?: () => void;
  toggleIsSpaceFavorite: (spaceId: string) => void;
  showChatButton?: boolean;
  numberOfUnreadMessages?: number;
  onLeave: () => void;
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
  onLeave
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
            />
          )}
        </>
      }
    >
      {children}
    </PageTopBar>
  );
};

export default observer(SpaceTopBar);
