import React from 'react';

import Button from '../../atoms/Button';
import {PopupTitle} from '../../atoms/Popup';
import {ReactComponent as InfoIcon} from '../../../images/icons/information-circle.svg';
import {ReactComponent as Mouse} from '../../../images/tutorial/mouse.svg';
import {ReactComponent as Shift} from '../../../images/tutorial/shift.svg';
import {ReactComponent as Space} from '../../../images/tutorial/spacebar.svg';
import {ReactComponent as Direction} from '../../../images/tutorial/controls.svg';

export interface TutorialPopupProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onClose?: () => void;
}

const TutorialPopup: React.FC<TutorialPopupProps> = ({onPrevious, onNext, onClose}) => {
  return (
    <div className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fixed flex flex-row space-x-0">
      <div className="bg-gradient-dark-blue-black-50 rounded relative flex flex-col items-center p-4 space-y-3">
        <div className="flex-grow-1" />
        <Direction />
        <Shift />
        <Space className="overflow-visible" />
        <Mouse />
        <div className="flex-grow-1" />
      </div>
      <div className="gradient-border bg-gradient-dark-blue-black-50 rounded relative p-4 flex-shrink-0 w-360px">
        <PopupTitle onClose={onClose} className="items-start">
          <InfoIcon className="w-2 mr-1 mt-.5 text-white fill-current flex-shrink-0" />
          How to fly
        </PopupTitle>
        <p>
          Ever dreamt that you could fly? In Momentum you can. To fly, use the following controls:
        </p>
        <br />
        <p>
          W - Forward
          <br />
          A - Left
          <br />
          S - Backward
          <br />
          D - Right
          <br />
          Q - Downward
          <br />E - Upward
        </p>
        <br />
        <p>Hold SHIFT while flying: Fast flight mode</p>
        <p>Hold SPACE while not moving: Look around</p>
        <br />
        <p>
          MOUSE or TRACKPAD: Turn camera
          <br />
          LEFT MOUSE BUTTON: Interact with objects
        </p>
        <br />
        <div className="flex justify-between mt-2 space-x-2">
          <Button type="ghost" onClick={onPrevious}>
            previous
          </Button>
          <Button type="primary" onClick={onNext}>
            next
          </Button>
        </div>
      </div>
      <div className="p-4 flex-shrink-0">
        <img alt="" src="img/flamingo.png" style={{width: 83, height: 210}} />
      </div>
    </div>
  );
};

export default TutorialPopup;
