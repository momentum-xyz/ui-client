import React from 'react';

import Button from '../../atoms/Button';
import Popup, {PopupTitle} from '../../atoms/Popup';

export interface AcceptedToJoinProps {
  onReady?: () => void;
  onDecline?: () => void;
  onClose?: () => void;
}

const AcceptedToJoinOnStagePopup: React.FC<AcceptedToJoinProps> = ({
  onReady,
  onDecline,
  onClose
}) => (
  <Popup className="w-37 transition-height">
    <PopupTitle size="s">Your request has been accepted</PopupTitle>

    <p className="mb-2 text-md font-medium pt-1">Would you like to go on stage?</p>
    <p className="text-xs">(This will enable you to talk, screenshare, and transmit video)</p>
    <div className="flex space-x-2 justify-center mt-3">
      <Button
        type="ghost"
        onClick={() => {
          if (onReady) {
            onReady();
            onClose?.();
          }
        }}
        size="m"
      >
        Get Ready
      </Button>
      <Button type="ghost-red" size="m" onClick={onDecline}>
        Decline
      </Button>
    </div>
  </Popup>
);

export default AcceptedToJoinOnStagePopup;
