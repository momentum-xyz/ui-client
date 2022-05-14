import React from 'react';

export interface StageModeLabelProps {
  type: 'ghost' | 'ghost-red' | 'ghost-white' | 'ghost-green';
  text: string;
  className?: string;
}

const StageModeLabel: React.FC<StageModeLabelProps> = ({type, text, className}) => {
  const backgroundColor = () => {
    switch (type) {
      case 'ghost':
        return 'bg-green-light-40';
      case 'ghost-red':
        return 'bg-red-sunset-20';
      case 'ghost-white':
        return 'bg-white-20';
      case 'ghost-green':
        return 'bg-green-light-50';
    }
  };

  const borderColor = () => {
    switch (type) {
      case 'ghost':
        return 'bg-green-light-40';
      case 'ghost-red':
        return 'border-red-sunset-80';
      case 'ghost-white':
        return 'border-white-100';
      case 'ghost-green':
        return 'border-green-light-100';
    }
  };

  return (
    <div
      className={`flex flex-row rounded border h-fit-content w-24 p-2 justify-between ${borderColor()} ${backgroundColor()} ${
        className as string
      }`}
    >
      <h1 className="uppercase text-lg pr-2.8 w-max">{text}</h1>
    </div>
  );
};

export default StageModeLabel;
