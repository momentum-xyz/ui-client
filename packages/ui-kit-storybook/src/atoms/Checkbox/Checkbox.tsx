import cn from 'classnames';
import {FC, memo} from 'react';

import * as styled from './Checkbox.styled';

export interface CheckboxPropsInterface {
  name: string;
  value?: boolean;
  label?: string;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}

const Checkbox: FC<CheckboxPropsInterface> = ({
  name,
  label = '',
  value = false,
  disabled,
  onChange
}) => {
  return (
    <styled.Label htmlFor={name}>
      <input
        id={name}
        type="checkbox"
        name={name}
        checked={value}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        className="input"
      />
      <span className="inputView" />
      {label && <span className={cn('label', disabled && 'disabled')}>{label}</span>}
    </styled.Label>
  );
};

export default memo(Checkbox);
