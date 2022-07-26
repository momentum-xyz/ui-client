import React, {FC} from 'react';

import {TopBar} from 'ui-kit';
import {PropsWithThemeInterface} from 'ui-kit/interfaces';
import {FavoriteStoreInterface} from 'stores/MainStore/models';

import {RightSection} from './components';

interface PropsInterface extends PropsWithThemeInterface {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  isAdmin?: boolean;
  spaceId?: string;
  favoriteStore: FavoriteStoreInterface;
}

const SpaceTopBar: FC<PropsInterface> = ({
  title,
  subtitle,
  spaceId,
  favoriteStore,
  isAdmin,
  children,
  onClose
}) => {
  return (
    <TopBar
      title={title}
      subtitle={subtitle}
      onClose={onClose}
      actions={<RightSection favoriteStore={favoriteStore} spaceId={spaceId} isAdmin={isAdmin} />}
    >
      {children}
    </TopBar>
  );
};

export default SpaceTopBar;
