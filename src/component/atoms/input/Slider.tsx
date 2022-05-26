import {InputHTMLAttributes} from 'react';

export interface SliderProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name?: string;
  value?: string;
}

export const Slider: React.FC<SliderProps> = (
  {children, type, className, label, name, value, ...restProps},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  {key}
) => {
  return (
    <div className="flex py-1 mb-1 mt-.5 justify-center items-center">
      {/* {label && (
        <label htmlFor={value} className="text-white-100 font-sans">
          {label}
        </label>
      )} */}
      <input
        id={value}
        name={name}
        value={value}
        type="range"
        className={`${className as string} w-full`}
        {...restProps}
      />
    </div>
  );
};
