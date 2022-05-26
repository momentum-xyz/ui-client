import React, {ReactNode} from 'react';

export interface SocialButtonProps {
  onClick?: () => void;
  text: string;
  icon?: ReactNode;
  iconPlacement?: 'left' | 'right';
  fullWidth?: boolean;
  selected?: boolean;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  text,
  icon,
  onClick,
  iconPlacement = 'right',
  fullWidth = false,
  selected = false
}) => (
  <button
    className={`flex border ${fullWidth ? 'w-full' : ''} border-green-light-100 rounded-[5px] 
      ${!selected ? 'hover:bg-green-light-10' : ''}
      ${selected ? 'bg-green-light-40' : ''}
      ${!onClick ? 'cursor-default' : ''}
      py-.5 px-.5 text-green-light-100 uppercase text-xs items-center
      justify-center`}
    onClick={onClick}
  >
    {icon && iconPlacement === 'left' && <div className="w-1.5 mr-1">{icon}</div>}
    {text}
    {icon && iconPlacement === 'right' && <div className="w-1.5 ml-1">{icon}</div>}
  </button>
);

export default SocialButton;
