import React, {useEffect, useState} from 'react';

import {useGetVibeCount, useVibeCheck, useVibeToggle} from '../../hooks/api/useVibeService';
import useWebsocketEvent from '../../context/Websocket/hooks/useWebsocketEvent';
import {ReactComponent as VibeIconBlue} from '../../images/icons/bulb-prime-blue.svg';
import {ReactComponent as VibeIcon} from '../../images/icons/bulb.svg';

import Button from './Button';

interface VibeButtonProps {
  spaceId: string;
}

const VibeButton: React.FC<VibeButtonProps> = (props) => {
  const [canVibe, , , refetchCanVibe] = useVibeCheck(props.spaceId);
  const [toggleVibe, , ,] = useVibeToggle(props.spaceId);
  const [vibeCountResponse, , ,] = useGetVibeCount(props.spaceId);
  const [vibeCount, setVibeCount] = useState(0);

  useWebsocketEvent('user-vibed', (type, count) => {
    setVibeCount(count);
  });

  useEffect(() => {
    if (vibeCountResponse?.count) {
      setVibeCount(vibeCountResponse.count);
    }
  }, [vibeCountResponse?.count]);

  const handleVibeToggle = () => {
    toggleVibe({
      vibeAction: canVibe ? '+1' : '-1'
    }).then(() => {
      refetchCanVibe();
    });
  };

  if (canVibe !== undefined) {
    return (
        <>
          <div className="w-1" />
          <Button type={canVibe ? 'ghost' : 'primary'} size="s" onClick={handleVibeToggle}>
          <span className={`mr-.5 uppercase ${canVibe ? '' : 'font-bold'}`}>
            {vibeCount === 1 ? `${vibeCount} vibe` : `${vibeCount} vibes`}
          </span>
            {canVibe ? <VibeIconBlue className="w-1.5" /> : <VibeIcon className="w-1.5" />}
          </Button>
        </>
    );
  }

  return null;
};

export default VibeButton;

