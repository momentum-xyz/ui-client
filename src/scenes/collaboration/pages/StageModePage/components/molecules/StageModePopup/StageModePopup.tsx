import React from 'react';

import {StageModePopupInfoInterface} from 'core/interfaces';
import {useStore} from 'shared/hooks';
import {StageModePopupTypeEnum} from 'core/enums';
import {Button} from 'ui-kit';

export interface StageModePopupPropsInterface {
  info: StageModePopupInfoInterface;
  canEnterStage: boolean;
}

const StageModePopup: React.FC<StageModePopupPropsInterface> = ({info, canEnterStage}) => {
  const {collaborationStore} = useStore();
  const {stageModeStore} = collaborationStore;
  const {removeRequestPopup, removeAwaitingPermissionPopup} = stageModeStore;

  const handleAccept = (info: StageModePopupInfoInterface) => {
    info
      ?.onAccept?.()
      .then((shouldClose) => shouldClose && info.userId && removeRequestPopup(info.userId));
  };

  const handleDecline = (info: StageModePopupInfoInterface) => {
    info
      ?.onDecline?.()
      .then((shouldClose) => shouldClose && info.userId && removeRequestPopup(info.userId));
  };

  const popupContent = (info: StageModePopupInfoInterface) => {
    switch (info.type) {
      case StageModePopupTypeEnum.AWAITING_PERMISSION:
        return (
          <div onClick={removeAwaitingPermissionPopup}>
            <p className="text-md">You have requested permission to go on stage</p>
            <p className="text-xs">Wait for the moderators to accept or deny your request</p>
          </div>
        );
      case StageModePopupTypeEnum.RECEIVED_PERMISSION_REQUEST:
        return (
          <>
            <div className="border-b-1 border-prime-blue-20 pb-2">
              <h1 className="text-md uppercase font-bold">
                {info.userName} Wants to come on Stage
              </h1>
            </div>
            <p className="text-md">This person wants to come on stage, invite them?</p>
            <p className="text-xs">
              {canEnterStage
                ? '(This will enable the person to talk, screenshare, and transmit video)'
                : '(The stage is currently full, you must first remove someone from the stage before you can accept)'}
            </p>
            <div className="flex space-x-2 justify-center">
              {canEnterStage ? (
                <Button
                  label="Accept"
                  variant="inverted"
                  size="small"
                  onClick={() => handleAccept(info)}
                />
              ) : (
                <Button label="Accept" variant="primary" size="small" />
              )}
              <Button label="Decline" variant="secondary" onClick={() => handleDecline(info)} />
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
