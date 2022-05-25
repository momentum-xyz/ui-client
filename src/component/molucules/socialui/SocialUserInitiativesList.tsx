import React from 'react';
import {useHistory} from 'react-router';

import {useStore} from 'shared/hooks';

import {UserSpace} from '../../../context/type/Space';
import {bytesToUuid} from '../../../core/utils/uuid.utils';
import {ReactComponent as FlyToIcon} from '../../../images/icons/space-rocket-flying.svg';
import UnityService from '../../../context/Unity/UnityService';
import {useJoinCollaborationSpaceByAssign} from '../../../context/Collaboration/hooks/useCollaboration';
import {ROUTES} from '../../../core/constants';

export interface SocialUsersInitiativesListProps {
  userInitiatives: UserSpace[];
}

const SocialUserInitiativesList: React.FC<SocialUsersInitiativesListProps> = ({
  userInitiatives
}) => {
  const joinMeetingSpace = useJoinCollaborationSpaceByAssign();
  const history = useHistory();

  const {
    homeStore: {exploreStore}
  } = useStore().defaultStore;

  const renderInitiatives = () => {
    if (!userInitiatives) {
      return;
    }

    return userInitiatives.map((item) => {
      if (!item.space) {
        return null;
      }

      const handleClick = () => {
        if (item.space) {
          exploreStore.selectSpace(bytesToUuid(item.space.id.data));
        }
      };

      const handleFlyToSpace = () => {
        if (!item.space) {
          return;
        }

        UnityService.teleportToSpace(bytesToUuid(item.space.id.data));
        history.push(ROUTES.base);

        if (process.env.NODE_ENV === 'development') {
          joinMeetingSpace(bytesToUuid(item.space.id.data)).then();
        }
      };

      return (
        <div
          key={bytesToUuid(item.space.id.data)}
          className="flex space-x-.5 text-xs text-white-90 border-b-1 border-green-light-10 py-1 items-center cursor-pointer"
          onClick={handleClick}
        >
          <button
            onClick={handleFlyToSpace}
            className="w-1.5 text-green-light-50 hover:text-green-light-100 flex-shrink-0"
          >
            <FlyToIcon />
          </button>
          <p className="text-sm hover:text-green-light-100">{item?.space?.name}</p>
          <div className="flex-grow" />
        </div>
      );
    });
  };

  return <div className="flex flex-col">{renderInitiatives()}</div>;
};

export default SocialUserInitiativesList;
