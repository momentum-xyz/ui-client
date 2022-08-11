import React, {InputHTMLAttributes} from 'react';

export interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  name?: string;
}

const Select: React.FC<SelectProps> = ({children, type, className, label, name, ...restProps}) => {
  return (
    <>
      {label && (
        <label
          htmlFor={name}
          className="block pt-2 mb-1 font-bold text-white-100 font-sans text-sm uppercase"
        >
          {label}
        </label>
      )}
      <select
        className={`bg-black-50 border-none h-4 px-1.5 mb-1
      text-white-100 font-normal text-base font-sans w-full
      focus:ring-red-sunset-40 focus:bg-red-sunset-20 focus:border-red-sunset-80`}
        name={name}
        {...restProps}
      >
        {children}
      </select>
    </>
  );
};

export default Select;

export interface OptionProps extends InputHTMLAttributes<HTMLOptionElement> {
  label?: string;
  name?: string;
}

export const Option: React.FC<OptionProps> = ({
  children,
  type,
  className,
  label,
  name,
  ...restProps
}) => {
  return (
    <option
      className={`mx-.5 hover:bg-white-20 active:bg-black-100 bg-black-100 border-none ${
        className as string
      }`}
      {...restProps}
    >
      {children}
    </option>
  );
};
