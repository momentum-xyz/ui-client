import React from 'react';

import {PopupTitle} from '../../atoms/Popup';
import Button from '../../atoms/Button';
import {ReactComponent as InfoIcon} from '../../../images/icons/information-circle.svg';
// import { ReactComponent as Badge } from '../../../images/tutorial/badge.svg';

export interface ReadyToLiftOffPopupProps {
  onPrevious?: () => void;
  onLiftOff?: () => void;
  onClose?: () => void;
}

const ReadyToLiftOffPopup: React.FC<ReadyToLiftOffPopupProps> = ({
  onPrevious,
  onLiftOff,
  onClose
}) => {
  return (
    <div className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fixed flex flex-row space-x-0">
      {/*<div className="p-4 flex flex-col h-full self-center">*/}
      {/*  <Badge />*/}
      {/*  <div className="flex-grow-1" />*/}
      {/*  <p className="text-center pb-1.5 uppercase font-bold text-xl">*/}
      {/*    YOU JUST EARNED THE ‘ALPHA RELEASE APE’ USER BADGE*/}
      {/*  </p>*/}
      {/*</div>*/}
      <div className="flex flex-col gradient-border bg-gradient-dark-blue-black-50 rounded relative p-4 w-360px flex-shrink-0 flex-grow">
        <PopupTitle onClose={onClose} className="items-start">
          <InfoIcon className="w-2 mr-1 mt-.5 text-white fill-current flex-shrink-0" />
          Ready for lift off?
        </PopupTitle>
        <p>
          Please note: This is the public Alpha-release of Momentum, which means everything is under
          construction and you may encounter bugs or errors. We are continuously developing features
          and working on stability and performance. With your bug reports and suggestions, we get
          the opportunity to learn and improve Momentum each day.
        </p>
        <br />
        <p>Together, we are building this rocket while flying.</p>
        <br />
        <p>
          Need additional help or access to support? Press the “?” icon in the bottom right. Enjoy
          your flight! ;)
        </p>
        <br />
        <div className="flex-grow" />
        <div className="flex justify-between mt-2 space-x-2">
          <Button type="ghost" onClick={onPrevious}>
            previous
          </Button>
          <Button type="primary" onClick={onLiftOff}>
            Lift off!
          </Button>
        </div>
      </div>
      <div className="p-4 flex-shrink-0">
        <img alt="" src="img/flamingo.png" style={{width: 83, height: 210}} />
      </div>
    </div>
  );
};

export default ReadyToLiftOffPopup;
