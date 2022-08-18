type ButtonProps = {
  type: 'primary' | 'ghost' | 'outline' | 'ghost-red' | 'mvp' | 'deny';
  size?: 'xxs' | 'xs' | 's' | 'sm' | 'm' | 'mm' | 'l';
  disabled?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  submit?: boolean;
  block?: boolean;
  className?: string;
};

const sizeStyle = {
  xxs: 'text-xxxs font-light normal-case py-.5 left-0 right-0 mr-1',
  xs: 'px-1.5 h-2 text-xs font-medium',
  s: 'px-1.5 h-3 text-xs font-medium',
  sm: 'text-xxxs pl-1.3 pr-2.6 font-light normal-case py-.8 rounded-sm',
  m: 'px-1.5 h-4 text-sm font-medium',
  mm: 'px-2 h-4 text-sm font-medium ',
  l: 'px-2 h-6 text-lg font-medium'
};

const typeStyle = {
  primary: 'bg-gradient-blue-green-100 text-dark-blue-100',
  ghost:
    'bg-gradient-blue-green-20 text-prime-blue-100 border border-gradient-blue-green-100 border-solid',
  outline:
    'bg-transparant text-white-100 border-white-100 border border-solid border-box shadow-white',
  'ghost-red':
    'bg-gradient-red-sunset-10 text-red-sunset-100 border border-gradient-red-sunset-10 border-solid',
  mvp: 'bg-prime-blue-40 text-white-90 normal-case',
  deny: 'bg-red-sunset-30 text-white-100 border-red-sunset-80 border'
};

const Button: React.FC<ButtonProps> = ({
  type,
  size = 'm',
  disabled = false,
  onClick,
  submit,
  block = false,
  className,
  children
}) => (
  <button
    className={`flex flex-row items-center justify-center uppercase font-sans flex-shrink-0 select-none 
    ${typeStyle[type]} 
    ${sizeStyle[size]} 
    ${block ? 'w-full' : 'w-max'}  
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className as string}`}
    onClick={onClick}
    disabled={disabled}
    type={submit ? 'submit' : 'button'}
  >
    {children}
  </button>
);

export default Button;

export const LinkButton: React.FC<ButtonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  type,
  size = 'm',
  disabled = false,
  onClick,
  submit,
  block = false,
  ...aProps
}) => (
  <a
    {...aProps}
    className={`flex items-center justify-center uppercase font-sans flex-shrink-0 no-webkit-styling 
    ${typeStyle[type]} 
    ${sizeStyle[size]} 
    ${block ? 'w-full' : 'w-max'}  
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    onClick={onClick}
    type={submit ? 'submit' : 'button'}
  >
    {aProps.children}
  </a>
);
