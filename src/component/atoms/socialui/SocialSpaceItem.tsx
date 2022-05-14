import React from 'react';
import {useHistory} from 'react-router';
import {observer} from 'mobx-react-lite';

import {IconSvg} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';

import {ReactComponent as FlyToIcon} from '../../../images/icons/space-rocket-flying.svg';
import {ReactComponent as NextIcon} from '../../../images/icons/SocialNext.svg';
import UnityService from '../../../context/Unity/UnityService';
import {bytesToUuid} from '../../../core/utils/uuid.utils';
import {Space} from '../../../context/type/Space';

export interface SocialSpaceItemProps {
  space: Space;
  onSelect: (Buffer) => void;
}

const SocialSpaceItem: React.FC<SocialSpaceItemProps> = ({space, onSelect}) => {
  const history = useHistory();
  const {favoriteStore} = useStore();

  const handleFlyToSpace = () => {
    if (space.id.data) {
      UnityService.teleportToSpace(bytesToUuid(space.id.data));
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
        onClick={() => onSelect(space.id.data)}
      >
        <p className="cursor-pointer pl-1 text-sm text-left">{space.name}</p>
        <div className="flex-grow" />
        {favoriteStore.isFavorite(bytesToUuid(space.id.data)) && (
          <div className="pr-1">
            <IconSvg name="starOn" size="normal" isCustom />
          </div>
        )}
        {space.children?.length !== 0 && (
          <NextIcon className="text-green-light-80 hover:text-green-light-100" />
        )}
      </button>
    </div>
  );
};

export default observer(SocialSpaceItem);
