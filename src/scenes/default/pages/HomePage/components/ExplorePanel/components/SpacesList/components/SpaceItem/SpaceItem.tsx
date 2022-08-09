import React from 'react';
import {useHistory} from 'react-router';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';

import {SvgButton} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {SubSpaceModelInterface} from 'core/models';

import * as styled from './SpaceItem.styled';

export interface SpaceItemPropsInterface {
  space: SubSpaceModelInterface;
  hasSubspaces: boolean;
  lastItem: boolean;
}

const SpaceItem: React.FC<SpaceItemPropsInterface> = ({space, hasSubspaces, lastItem}) => {
  const history = useHistory();
  const {
    mainStore: {unityStore, favoriteStore},
    defaultStore: {homeStore}
  } = useStore();

  const {exploreStore} = homeStore;

  if (!space.id) {
    return null;
  }

  const handleFlyToSpace = () => {
    if (space.id) {
      unityStore.teleportToSpace(space.id);
      history.push(ROUTES.base);
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
        <div className="flex-grow" />
        {space.id && favoriteStore.isFavorite(space.id) && (
          <styled.FavouriteIcon name="starOn" size="normal" isCustom />
        )}
        {hasSubspaces && <styled.NextButton iconName="chevron" size="medium" />}
      </styled.ClickableItem>
    </styled.Container>
  );
};

export default observer(SpaceItem);
