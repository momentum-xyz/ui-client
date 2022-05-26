import React, {useEffect, useState} from 'react';

import Button from '../../../component/atoms/Button';
import Popup, {PopupTitle} from '../../../component/atoms/Popup';

type props = {
  title: string;
  onSave: () => void;
  onClose: () => void;
};

export const CountdownPopup = ({onSave, onClose, title}: props) => {
  const [countdown, setCountdown] = useState<number>(3);

  useEffect(() => {
    if (countdown > 0) {
      setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else {
      onSave();
    }
  }, [countdown]);

  return (
    <Popup className="w-48 transition-height">
      <PopupTitle onClose={onClose}>{title}</PopupTitle>
      <p className="mb-2">Get ready. You are about to go live in.</p>
      <div className="flex justify-center">
        <span className="text-prime-blue-100 font-sans text-[5rem]">{countdown}</span>
      </div>
      <div className="flex justify-center mt-2">
        <Button type="ghost" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Popup>
  );
};
