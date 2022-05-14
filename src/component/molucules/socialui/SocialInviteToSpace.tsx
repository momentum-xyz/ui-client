import React, {useEffect} from 'react';

import {SocialOnlineUsersList} from 'scenes/widgets/pages/OnlineUsersWidget/components/SocialOnlineUsersList';
import {useStore} from 'shared/hooks';

import {ReactComponent as PeopleIcon} from '../../../images/icons/location-user.svg';
import {ReactComponent as CloseIcon} from '../../../images/icons/close.svg';

interface SocialInviteToSpaceProps {
  onClose?: () => void;
}

const SocialInviteToSpace: React.FC<SocialInviteToSpaceProps> = ({onClose}) => {
  const {
    widgetStore: {onlineUsersStore}
  } = useStore();

  useEffect(() => {
    onlineUsersStore.setSearchQuery('');
  }, []);

  return (
    <div className="z-pop-over rounded bg-new-blue-80 backdrop-filter backdrop-blur w-20">
      <div className="flex items-center space-x-1 font-semibold block text-base text-green-light-100 p-1">
        <PeopleIcon className="w-1.6 h-1.6" />
        <p>Invite Users</p>
        <div className="flex-grow" />
        <button className="w-1.4 cursor-pointer " onClick={onClose}>
          <CloseIcon className="hover:drop-shadow-white focus-within:drop-shadow-white" />
        </button>
      </div>
      <SocialOnlineUsersList invite />
    </div>
  );
};

export default SocialInviteToSpace;
