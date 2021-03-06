import React, {FC} from 'react';

import {PageTopBar} from 'ui-kit';
import {PropsWithThemeInterface} from 'ui-kit/interfaces';

import {RightSection} from './components';

interface PropsInterface extends PropsWithThemeInterface {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  isAdmin?: boolean;
  spaceId?: string;
  editSpaceHidden?: boolean;
  isSpaceFavorite: boolean;
  isChatOpen: boolean;
  toggleChat: () => void;
  toggleIsSpaceFavorite: (spaceId: string) => void;
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
  onClose
}) => {
  return (
    <PageTopBar
      title={title}
      subtitle={subtitle}
      onClose={onClose}
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
