import React from 'react';

import {ReactComponent as ContinueIcon} from '../../../images/icons/arrow-right-1.svg';

export interface BrowseItemProps {
  title: string;
  selected: boolean;
  // @ts-ignore: refactoring
  onClick: (event) => void;
}

const BrowseItem: React.FC<BrowseItemProps> = ({title, selected, onClick}) => (
  <div className="border-b border-black-50 text-prime-blue-100">
    <button className="w-full text-left" onClick={onClick}>
      <div
        className={`flex flex-row items-center pl-2 pr-1 py-1 my-1 ${
          selected ? 'bg-gradient-blue-green-20 font-bold' : ''
        }`}
      >
        <p className="break-all lg:break-normal">{title}</p>
        <div className="flex-grow h-0" />
        {selected && <ContinueIcon className="h-1.5 flex-shrink-0 fill-current prime-blue-100" />}
      </div>
    </button>
  </div>
);

export default BrowseItem;
