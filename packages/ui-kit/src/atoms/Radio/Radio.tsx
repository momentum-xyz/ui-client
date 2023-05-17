import {FC, memo} from 'react';

import * as styled from './Radio.styled';

export interface RadioOptionInterface {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioPropsInterface {
  name: string;
  value?: string | null;
  options: RadioOptionInterface[];
  onChange?: (value: string) => void;
}

const Radio: FC<RadioPropsInterface> = ({name, value, options, onChange}) => {
  console.log(value);

  return (
    <styled.RadioList data-testid="Radio-test">
      {options.map((option) => (
        <styled.Form key={option.value}>
          <input
            id={option.value}
            type="radio"
            name={name}
            value={option.value}
            checked={option.value === value}
            disabled={option.disabled}
            onChange={() => {
              onChange?.(option.value);
            }}
          />
          <label htmlFor={option.value}>
            <div className="mark" />
            <span>{option.label}</span>
          </label>
        </styled.Form>
      ))}
    </styled.RadioList>
  );
};

export default memo(Radio);
