import React from 'react';

import {LinkButton} from '../atoms/Button';
import Popup, {PopupTitle} from '../atoms/Popup';

export interface PDFPopupProps {
  onClose?: () => void;
}

const PDFPopup: React.FC<PDFPopupProps> = ({onClose}) => {
  return (
    <Popup className="sm:w-10/12 md:w-94 lg:w-64">
      <PopupTitle onClose={onClose}>Get help</PopupTitle>
      <div className="mt-1">
        <a
          target="_blank"
          rel="noreferrer"
          href="https://wiki.odyssey.org/momentum/user-manual"
          onClick={onClose}
          className="float-left pr-1 pb-1"
        >
          <img src="/icons/manual.png" alt="Odyssey Momentum logo" title="Odyssey Momentum" />
        </a>
        <p>Our comprehensive tutorial on using Momentum.</p>
      </div>
      <div className="mt-1">
        <a
          target="_blank"
          rel="noreferrer"
          href="https://discord.gg/Areu4Drw2J"
          onClick={onClose}
          className="float-left clear-left pr-1 pb-1"
        >
          <img src="/icons/discord.png" alt="Odyssey Momentum logo" title="Odyssey Momentum" />
        </a>
        <p className=" mt-2">
          Need assistance? Visit our official Discord server and ask our support team to help!
        </p>
      </div>
      <div className="flex gap-1 mt-2">
        <LinkButton
          type="ghost"
          target="_blank"
          href="https://wiki.odyssey.org/momentum/user-manual"
          onClick={onClose}
        >
          User Manual
        </LinkButton>
        <LinkButton
          type="ghost"
          target="_blank"
          href="https://discord.gg/6PH9nSu7UP"
          onClick={onClose}
        >
          Get assistance
        </LinkButton>
      </div>
    </Popup>
  );
};

export default PDFPopup;
