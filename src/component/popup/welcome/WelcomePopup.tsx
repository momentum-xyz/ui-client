import React from 'react';

import Button from '../../atoms/Button';
import {ReactComponent as InfoIcon} from '../../../images/icons/information-circle.svg';
import {PopupTitle} from '../../atoms/Popup';

export interface WelcomePopupProps {
  onReadyToFly?: () => void;
  onQuickIntro?: () => void;
  onClose?: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({onReadyToFly, onQuickIntro, onClose}) => {
  return (
    <div className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fixed flex flex-row items-center space-x-0">
      <div className="gradient-border bg-gradient-dark-blue-black-50 rounded relative p-4 w-360px">
        <PopupTitle onClose={onClose} className="items-start">
          <InfoIcon className="w-2 mr-1 mt-.5 text-white fill-current flex-shrink-0" />
          Exploring Odyssey Momentum
        </PopupTitle>
        <p>
          Welcome to Odyssey Momentum, the 3D space to meet, collaborate and achieve results in
          real-time. Would you like a quick introduction / how to?
        </p>
        <div className="flex justify-between mt-2 space-x-2">
          <Button type="ghost" onClick={onReadyToFly}>
            I am ready to fly
          </Button>
          <Button type="primary" onClick={onQuickIntro}>
            Quick intro
          </Button>
        </div>
      </div>
      <div className="p-4">
        <img
          src={process.env.PUBLIC_URL + '/img/flamingo.png'}
          style={{width: 83, height: 210}}
          alt="logo"
        />
      </div>
    </div>
  );
};

export default WelcomePopup;
