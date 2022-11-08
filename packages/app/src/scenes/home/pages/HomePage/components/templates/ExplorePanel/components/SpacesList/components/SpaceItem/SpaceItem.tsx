import React from 'react';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';
import {SvgButton} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {SpaceInfoModelInterface} from 'core/models';

import * as styled from './SpaceItem.styled';

export interface SpaceItemPropsInterface {
  space: SpaceInfoModelInterface;
  hasSubspaces: boolean;
  lastItem: boolean;
}

// TODO: Removal next PR
const SpaceItem: React.FC<SpaceItemPropsInterface> = ({space, hasSubspaces, lastItem}) => {
  const {mainStore, homeStore} = useStore();
  const {unityStore, favoriteStore} = mainStore;
  const {exploreStore} = homeStore;

  if (!space.id) {
    return null;
  }

  const handleFlyToSpace = () => {
    if (space.id) {
      unityStore.teleportToSpace(space.id);
    }
  };

  const handleSelect = () => {
    exploreStore.selectSpace(space.id);
  };

  return (
    <styled.Container className={cn(lastItem && 'noBorder')} data-testid="SpaceItem-test">
      <SvgButton iconName="rocket" size="medium" onClick={() => handleFlyToSpace()} />
      <styled.ClickableItem onClick={handleSelect}>
        <styled.SpaceNameText text={space.name} size="xs" align="left" isMultiline={false} />
        <styled.Spacer />
        {space.id && favoriteStore.isFavorite(space.id) && (
          <styled.FavouriteIcon name="starOn" size="normal" />
        )}
        {hasSubspaces && <styled.NextButton iconName="chevron" size="medium" />}
      </styled.ClickableItem>
    </styled.Container>
  );
};

export default observer(SpaceItem);
