import React, {FC, InputHTMLAttributes} from 'react';
import cn from 'classnames';

import * as styled from './Toggle.styled';

interface PropsInterface extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked;
  onChange: (checked: boolean) => void;
}

const Toggle: FC<PropsInterface> = ({checked, onChange, ...restProps}) => {
  return (
    <styled.Container>
      <styled.Background className={cn(checked ? 'on' : 'off')} onClick={() => onChange(!checked)}>
        <styled.HiddenInput {...restProps} checked={checked} readOnly type="checkbox" />
        <styled.Toggle />
      </styled.Background>
    </styled.Container>
  );
};

export default Toggle;
