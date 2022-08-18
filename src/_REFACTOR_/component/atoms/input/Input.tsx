import React, {InputHTMLAttributes, useState} from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name?: string;
  pattern?: string;
  transparent?: boolean;
}

export type InputRef = React.ElementRef<typeof Input>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({children, type, className, label, name, pattern, transparent = false, ...restProps}, ref) => {
    return (
      <div className={`w-full ${transparent ? 'bg-transparant' : 'bg-gradient-input'} mb-1`}>
        {label && (
          <label
            htmlFor={name}
            className="block pt-2 px-2 mb-0 font-bold text-white-100 font-sans text-sm uppercase"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={name}
          name={name}
          pattern={pattern}
          type={type}
          className={`${className ?? ''} bg-transparant focus-visible:shadow-none w-full ${
            label ? 'px-2 pb-2 pt-1' : 'p-2'
          } `}
          {...restProps}
        />
      </div>
    );
  }
);

export default Input;

export interface SocialProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name?: string;
  pattern?: string;
}
export const SocialInput: React.FC<InputProps> = ({
  children,
  type,
  className,
  label,
  name,
  pattern,
  ...restProps
}) => {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block pt-1 px-1 mb-.5 font-bold text-green-light-100 font-sans text-sm uppercase"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        pattern={pattern}
        type={type}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`${className ?? ''} border-1 ${
          hovered || focused
            ? 'bg-white-5 border-green-light-100'
            : 'bg-gradient-input border-transparant'
        } rounded focus:outline-none focus-visible:shadow-none w-full px-1 py-.5`}
        {...restProps}
      />
    </div>
  );
};

export interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  name?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  children,
  className,
  label,
  name,
  ...restProps
}) => {
  return (
    <div>
      <div className={`${className ?? ''} w-full bg-gradient-input mb-1 overflow-hidden`}>
        {label && (
          <label
            htmlFor={name}
            className="block pt-2 px-2 mb-0 font-bold text-white-100 font-sans text-sm uppercase"
          >
            {label}
          </label>
        )}
        <textarea
          id={name}
          name={name}
          className={`bg-transparant focus-visible:shadow-none w-full ${
            label ? 'px-2 pb-2 pt-1' : 'p-2'
          } ${className ?? ''}`}
          {...restProps}
        />
      </div>
    </div>
  );
};

export interface SocialTextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  name?: string;
}

export const SocialTextArea: React.FC<SocialTextAreaProps> = ({
  children,
  className,
  label,
  name,
  ...restProps
}) => {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <div className={`${className ?? ''} w-full mb-1 overflow-hidden`}>
        {label && (
          <label
            htmlFor={name}
            className="block pt-1 px-1 mb-.5 font-bold text-green-light-100 font-sans text-sm uppercase"
          >
            {label}
          </label>
        )}
        <div
          className={`border-1 ${
            hovered || focused
              ? 'bg-white-5 border-green-light-100'
              : 'bg-gradient-input border-transparant'
          } focus-visible:shadow-none w-full rounded `}
        >
          <textarea
            id={name}
            name={name}
            onFocus={() => {
              setFocused(true);
            }}
            onBlur={() => {
              setFocused(false);
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`${className ?? ''} w-full h-full text-sm bg-transparant px-1 py-0`}
            {...restProps}
          />
        </div>
      </div>
    </div>
  );
};

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  children,
  type,
  className,
  label,
  name,
  ...restProps
}) => {
  return (
    <div className="flex pb-.5 items-center">
      <input
        id={name}
        name={name}
        type="checkbox"
        className={`${className ?? ''} mb-0`}
        {...restProps}
      />
      {label && (
        <label htmlFor={name} className="pl-1 cursor-pointer text-white-100 font-sans">
          {label}
        </label>
      )}
    </div>
  );
};

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name?: string;
  value?: string;
}

export const Radio: React.FC<RadioProps> = ({
  children,
  type,
  className,
  label,
  name,
  value,
  ...restProps
}) => {
  return (
    <div className="flex pb-.5 items-center">
      <input
        id={value}
        name={name}
        value={value}
        type="radio"
        className={`${className ?? ''} mb-0`}
        {...restProps}
      />
      {label && (
        <label htmlFor={value} className="pl-1 cursor-pointer text-white-100 font-sans">
          {label}
        </label>
      )}
    </div>
  );
};

export interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  label2?: string;
  name: string;
}

export const Switch: React.FC<SwitchProps> = ({
  children,
  type,
  className,
  label,
  label2,
  name,
  value,
  ...restProps
}) => {
  return (
    <label className="flex pb-.5 items-center cursor-pointer">
      {label2 && <span className="pr-1">{label2}</span>}
      <div className="relative block border border-white-100 slider-label">
        <input
          id={name}
          name={name}
          type="checkbox"
          className={`${className ?? ''} mb-0 hidden`}
          {...restProps}
        />
        <span className="switch"></span>
      </div>
      {label && <span className="pl-1">{label}</span>}
    </label>
  );
};
