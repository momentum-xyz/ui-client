import {FC, memo} from 'react';
import cn from 'classnames';

import * as styled from './Radio.styled';

export interface RadioOptionInterface {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioPropsInterface {
  name: string;
  value?: string | null;
  horizontal?: boolean;
  options: RadioOptionInterface[];
  onChange?: (value: string) => void;
}

const Radio: FC<RadioPropsInterface> = ({name, value, options, onChange, horizontal = false}) => {
  console.log(value);

  return (
    <styled.RadioList data-testid="Radio-test" className={cn(horizontal && 'horizontal')}>
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
