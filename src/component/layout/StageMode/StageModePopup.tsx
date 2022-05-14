import React from 'react';

import Button from '../../atoms/Button';
import {
  useStageModePopupQueueContext,
  StageModePopupType,
  StageModePopupInfo
} from '../../../context/StageMode/StageModePopupQueueContext';
import {useUser} from '../../../hooks/api/useUser';

export interface StageModePopupProps {
  info: StageModePopupInfo;
  canEnterStage: boolean;
}

const StageModePopup: React.FC<StageModePopupProps> = ({info, canEnterStage}) => {
  const {removeRequestPopup, removeAwaitingPermissionPopup} = useStageModePopupQueueContext();

  const [user] = useUser(info.userId as string);

  const handleAccept = (info: StageModePopupInfo) => {
    info
      ?.onAccept?.()
      .then((shouldClose) => shouldClose && info.userId && removeRequestPopup(info.userId));
  };

  const handleDecline = (info: StageModePopupInfo) => {
    info
      ?.onDecline?.()
      .then((shouldClose) => shouldClose && info.userId && removeRequestPopup(info.userId));
  };

  const popupContent = (info: StageModePopupInfo) => {
    switch (info.type) {
      case StageModePopupType.AWAITING_PERMISSION:
        return (
          <div onClick={removeAwaitingPermissionPopup}>
            <p className="text-md">You have requested permission to go on stage</p>
            <p className="text-xs">Wait for the moderators to accept or deny your request</p>
          </div>
        );
      case StageModePopupType.RECEIVED_PERMISSION_REQUEST:
        return (
          <>
            <div className="border-b-1 border-prime-blue-20 pb-2">
              <h1 className="text-md uppercase font-bold">{user?.name} Wants to come on Stage</h1>
            </div>
            <p className="text-md">This person wants to come on stage, invite them?</p>
            <p className="text-xs">
              {canEnterStage
                ? '(This will enable the person to talk, screenshare, and transmit video)'
                : '(The stage is currently full, you must first remove someone from the stage before you can accept)'}
            </p>
            <div className="flex space-x-2 justify-center">
              {canEnterStage ? (
                <Button type="ghost" size="s" onClick={() => handleAccept(info)}>
                  Accept
                </Button>
              ) : (
                <Button type="outline" size="s">
                  Accept
                </Button>
              )}
              <Button type="ghost-red" size="s" onClick={() => handleDecline(info)}>
                Decline
              </Button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="w-24.2 relative z-popover bg-dark-blue-70 rounded p-2 flex-col space-y-2 gradient-border">
      {popupContent(info)}
    </div>
  );
};

export default StageModePopup;
