import React, {useEffect, useState} from 'react';

import {useInitiatives} from '../../../hooks/api/useUser';

import SocialUserInitiativesList from './SocialUserInitiativesList';

export interface SocialUserInitiativesProps {
  userId: string;
}

const SocialUserInitiatives: React.FC<SocialUserInitiativesProps> = ({userId}) => {
  const [initiatives, , ,] = useInitiatives(userId);
  const [userInitiatives, setUserInitiatives] = useState<any>();

  useEffect(() => {
    setUserInitiatives(initiatives);
  }, [initiatives]);

  return (
    <div className="flex flex-col ml-1 h-full pt-1 overflow-hidden">
      <div className="font-bold text-green-light-100">Initiatives:</div>
      <div className="max-h-full overflow-y-scroll" style={{width: 'calc(100% + 2px)'}}>
        {userInitiatives && userInitiatives.length < 1 ? (
          <div className="ml-.3">-</div>
        ) : (
          <SocialUserInitiativesList userInitiatives={userInitiatives} />
        )}
      </div>
    </div>
  );
};

export default SocialUserInitiatives;
