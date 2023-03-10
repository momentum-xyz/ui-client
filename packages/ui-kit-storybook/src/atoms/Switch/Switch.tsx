import {FC, memo} from 'react';

import * as styled from './Switch.styled';

export interface SwitchPropsInterface {
  name: string;
  value?: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}

const Switch: FC<SwitchPropsInterface> = ({name, value = false, disabled, onChange}) => {
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
    </styled.Label>
  );
};

export default memo(Switch);
