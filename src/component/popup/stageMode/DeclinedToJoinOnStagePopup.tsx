import React from 'react';

import Button from '../../atoms/Button';
import Popup, {PopupTitle} from '../../atoms/Popup';

export interface AcceptedToJoinProps {
  onClose?: () => void;
}

const DeclinedToJoinOnStagePopup: React.FC<AcceptedToJoinProps> = ({onClose}) => (
  <Popup className="w-37 transition-height">
    <PopupTitle size="s">Your request was declined</PopupTitle>
    <p className="mb-2 text-md font-medium pt-1">Please try again later</p>
    <div className="flex space-x-2 justify-center mt-3">
      <Button type="ghost-red" size="m" onClick={onClose}>
        Close
      </Button>
    </div>
  </Popup>
);

export default DeclinedToJoinOnStagePopup;
