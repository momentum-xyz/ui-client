import React from 'react';
import {useHistory} from 'react-router';
import {observer} from 'mobx-react-lite';

import {IconSvg} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {SubSpaceModelInterface} from 'core/models';

import {ReactComponent as FlyToIcon} from '../../../images/icons/space-rocket-flying.svg';
import {ReactComponent as NextIcon} from '../../../images/icons/SocialNext.svg';

export interface SpaceItemPropsInterface {
  space: SubSpaceModelInterface;
  hasSubspaces: boolean;
  onSelect: (spaceId?: string) => void;
}

const SpaceItem: React.FC<SpaceItemPropsInterface> = ({space, onSelect, hasSubspaces}) => {
  const history = useHistory();
  const {
    favoriteStore,
    mainStore: {unityStore}
  } = useStore();

  if (!space.id) {
    return null;
  }

  const handleFlyToSpace = () => {
    if (space.id) {
      unityStore.teleportToSpace(space.id);
      history.push(ROUTES.base);
    }
  };

  return (
    <div className="flex px-1 py-1.2 border-t-1 border-green-light-10">
      <button onClick={() => handleFlyToSpace()}>
        <FlyToIcon className="w-1.6 h-1.6 text-green-light-50 hover:text-green-light-100" />
      </button>
      <button
        className="flex w-full hover:text-green-light-100 hover:stroke-current"
        onClick={() => onSelect(space.id)}
      >
        <p className="cursor-pointer pl-1 text-sm text-left">{space.name}</p>
        <div className="flex-grow" />
        {space.id && favoriteStore.isFavorite(space.id) && (
          <div className="pr-1">
            <IconSvg name="starOn" size="normal" isCustom />
          </div>
        )}
        {hasSubspaces && <NextIcon className="text-green-light-80 hover:text-green-light-100" />}
      </button>
    </div>
  );
};

export default observer(SpaceItem);
