import React from 'react';
import {toast} from 'react-toastify';
import {t} from 'i18next';

import {ToastContent} from 'ui-kit';

import Popup, {PopupTitle} from '../../atoms/Popup';
import Avatar from '../../atoms/Avatar';
import Button from '../../atoms/Button';
import {bytesToUuid} from '../../../core/utils/uuid.utils';
import User from '../../../context/type/User';
import {useStageModeRequestInvite} from '../../../hooks/api/useStageModeService';
import useCollaboration from '../../../context/Collaboration/hooks/useCollaboration';

export interface StageModeInviteToStagePopupProps {
  user: User | undefined;
  onClose?: () => void;
}

const StageModeInviteToStagePopup: React.FC<StageModeInviteToStagePopupProps> = ({
  user,
  onClose
}) => {
  const {collaborationState} = useCollaboration();

  const inviteRequest = useStageModeRequestInvite(collaborationState.collaborationSpace?.id);

  const handleInviteClick = () => {
    if (user?.id.data)
      {inviteRequest(bytesToUuid(user.id.data))
        .then(onClose)
        .catch(() =>
          toast.error(
            <ToastContent
              isDanger
              headerIconName="alert"
              title={t('titles.alert')}
              text={t('messages.inviteToStageFailure', {
                user: user.name
              })}
              isCloseButton
            />
          )
        );}
  };

  return (
    <Popup className="w-36">
      <PopupTitle>
        <Avatar size="xm" avatarHash={user?.profile.avatarHash} />
        <p className="pl-1 text-md">{user?.name}</p>
      </PopupTitle>
      <p className="text-sm">Invite this person to the stage?</p>
      <br />
      <p className="text-xs">
        (This will enable the person to talk, screenshare, and transmit video)
      </p>
      <div className="flex flex-row space-x-2 pt-2">
        <Button type="ghost" onClick={handleInviteClick}>
          Invite to stage
        </Button>
        <Button type="ghost-red" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Popup>
  );
};

export default StageModeInviteToStagePopup;
