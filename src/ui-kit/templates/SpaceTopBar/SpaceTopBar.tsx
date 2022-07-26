import React, {FC} from 'react';

import {PageTopBar} from 'ui-kit';
import {PropsWithThemeInterface} from 'ui-kit/interfaces';
import {FavoriteStoreInterface} from 'stores/MainStore/models';

import {RightSection} from './components';

interface PropsInterface extends PropsWithThemeInterface {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  isAdmin?: boolean;
  spaceId?: string;
  editSpaceHidden?: boolean;
  favoriteStore: FavoriteStoreInterface;
}

const SpaceTopBar: FC<PropsInterface> = ({
  title,
  subtitle,
  spaceId,
  favoriteStore,
  isAdmin,
  editSpaceHidden,
  children,
  onClose
}) => {
  return (
    <PageTopBar
      title={title}
      subtitle={subtitle}
      onClose={onClose}
      actions={
        <RightSection
          editSpaceHidden={editSpaceHidden}
          favoriteStore={favoriteStore}
          spaceId={spaceId}
          isAdmin={isAdmin}
        />
      }
    >
      {children}
    </PageTopBar>
  );
};

export default SpaceTopBar;
