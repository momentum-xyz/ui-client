import {useCoordinates} from '@momentum-xyz/ui-kit';
import {FC, useRef} from 'react';

import * as styled from './VoiceChatUser.styled';
import {VoiceChatUserActions} from './VoiceChatUserActions';
const OFFSET_RIGHT = 150;
const OFFSET_BOTTOM = 0;

interface PropsInterface {
  name?: string;
  avatarSrc?: string;
  soundLevel: number;
  isRemote?: boolean;
  onUserKick?: () => void;
  onUserMute?: () => void;
}

const RemoteVoiceChatUser: FC<PropsInterface> = ({
  avatarSrc,
  soundLevel,
  name,
  onUserKick,
  onUserMute,
  isRemote = false
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const {coords, isShown, setIsShown, updateCoords} = useCoordinates(
    menuRef,
    OFFSET_RIGHT,
    OFFSET_BOTTOM
  );

  const handleOpenMenu = () => {
    updateCoords();
    setIsShown(true);
  };

  return (
    <styled.Attendee ref={menuRef} onClick={handleOpenMenu}>
      <styled.AttendeeAvatar size="medium" avatarSrc={avatarSrc} showBorder={soundLevel > 3} />
      <styled.AttendeeName text={name} size="xs" isMultiline={false} />
      {isRemote && isShown && (
        <VoiceChatUserActions
          name={name ?? ''}
          onUserKick={onUserKick}
          onUserMute={onUserMute}
          coords={coords}
          onClose={() => setIsShown(false)}
        />
      )}
    </styled.Attendee>
  );
};

export default RemoteVoiceChatUser;
