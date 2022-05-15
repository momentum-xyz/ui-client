import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';

import {useGetSpace} from '../../../hooks/api/useSpaceService';
import {bytesToUuid} from '../../../core/utils/uuid.utils';
import {useJoinCollaborationSpaceByAssign} from '../../../context/Collaboration/hooks/useCollaboration';
import UnityService from '../../../context/Unity/UnityService';
import {ReactComponent as SpaceRocketIcon} from '../../../images/icons/space-rocket-flying.svg';
import {ReactComponent as NextIcon} from '../../../images/icons/SocialNext.svg';
import SocialButton from '../../atoms/socialui/SocialButton';

import SocialSpacesList from './SocialSpacesList';

interface SocialSelectedSpaceProps {
  spaceId: string;
  fatherSpaceName: string;
  onBack: () => void;
  ancestors: string[];
}

const SocialSelectedSpace: React.FC<SocialSelectedSpaceProps> = ({
  spaceId,
  ancestors,
  fatherSpaceName,
  onBack
}) => {
  const [spaceResponse] = useGetSpace(spaceId);
  const [selectedSpace, setSelectedSpace] = useState<Buffer>();
  const joinMeetingSpace = useJoinCollaborationSpaceByAssign();
  const history = useHistory();

  const handleFlyToSpace = () => {
    UnityService.teleportToSpace(spaceId);
    history.push(ROUTES.base);

    if (process.env.NODE_ENV === 'development') {
      joinMeetingSpace(spaceId);
    }
  };

  useEffect(() => {
    if (!spaceResponse?.space.id.data) {
      return;
    }

    if (spaceId !== bytesToUuid(spaceResponse.space.id.data)) {
      setSelectedSpace(undefined);
    }
  }, [spaceId, spaceResponse?.space.id]);

  if (selectedSpace) {
    return (
      <SocialSelectedSpace
        spaceId={bytesToUuid(selectedSpace)}
        fatherSpaceName={spaceResponse?.space.name ?? ''}
        ancestors={spaceResponse?.space.name ? [...ancestors, spaceResponse.space.name] : []}
        onBack={() => {
          setSelectedSpace(undefined);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div
        className="flex py-1 items-center space-x-1 border-b-1 border-green-light-10 border-solid cursor-pointer px-1 text-green-light-70 hover:text-green-light-100 hover:stroke-current"
        onClick={onBack}
      >
        <NextIcon className="rotate-180" />
        <p className="text-md cursor-pointer font-bold">{fatherSpaceName}</p>
      </div>
      <div
        className={`flex flex-col h-full justify-between pt-1 px-1 ${
          spaceResponse?.children.length === 0 ? 'pb-1' : ''
        }`}
      >
        <div className="text-lg text-green-light-90 uppercase font-bold">
          {spaceResponse?.space.name}
        </div>
        <div className="text-sm pb-.5">{spaceResponse?.space.description}</div>
        <div className="w-full py-1">
          <SocialButton
            onClick={handleFlyToSpace}
            iconPlacement="left"
            text="Fly to this space"
            icon={<SpaceRocketIcon />}
            fullWidth
          />
        </div>
      </div>
      {spaceResponse?.children.length !== 0 && (
        <div className="flex flex-col pt-1 overflow-hidden">
          <h1 className="text-sm text-green-light-100 px-1 pb-1 overflow-hidden">Subspaces:</h1>
          {spaceResponse && (
            <SocialSpacesList
              spaceId={spaceResponse.space.id.data}
              onSpaceSelect={setSelectedSpace}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SocialSelectedSpace;
