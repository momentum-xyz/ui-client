import React from 'react';

import {Switch} from '../input/Input';

export interface StageModeToggleProps {
  isActivated: boolean;
  onToggle: (shouldActivate: boolean) => void;
}

const StageModeToggle: React.FC<StageModeToggleProps> = ({isActivated, onToggle}) => {
  const handleToggle = () => {
    onToggle(!isActivated);
  };

  return (
    <div
      className={`flex flex-col space-y-1.4 rounded h-fit-content p-2 ${
        isActivated ? 'bg-red-sunset-20' : 'bg-green-light-40'
      }`}
    >
      <h1 className="uppercase text-lg pr-2.8 w-max">Stage Mode Toggle</h1>
      <Switch
        name="stage-mode-toggle"
        checked={isActivated}
        label={isActivated ? 'Deactivate?' : 'Activate?'}
        onChange={handleToggle}
      />
    </div>
  );
};

export default StageModeToggle;
