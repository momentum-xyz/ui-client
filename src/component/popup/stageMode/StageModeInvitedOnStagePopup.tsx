import React from 'react';

import Popup, {PopupTitle} from '../../atoms/Popup';
import Button from '../../atoms/Button';

export interface StageModeInvitedOnStagePopupProps {
  onClose?: () => void;
  onGetReady?: () => void;
  onDecline?: () => void;
}

const StageModeInvitedOnStagePopup: React.FC<StageModeInvitedOnStagePopupProps> = ({
  onDecline,
  onClose,
  onGetReady
}) => (
  <Popup className="w-36">
    <PopupTitle>
      <p className="text-md">You have been invited on stage</p>
    </PopupTitle>
    <p className="text-sm">Would you like to go on stage?</p>
    <br />
    <p className="text-xs">(This will enable the you to talk, screenshare, and transmit video)</p>
    <div className="flex flex-row space-x-2 pt-2">
      <Button
        type="ghost"
        onClick={() => {
          if (onGetReady) {
            onGetReady();
            onClose?.();
          }
        }}
      >
        Get Ready
      </Button>
      <Button type="ghost-red" onClick={onDecline}>
        Decline
      </Button>
    </div>
  </Popup>
);

export default StageModeInvitedOnStagePopup;
