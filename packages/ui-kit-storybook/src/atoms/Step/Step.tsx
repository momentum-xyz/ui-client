import {FC, memo} from 'react';
import cn from 'classnames';

import {IconSvg} from '../../atoms';
import {IconNameType} from '../../types';

import * as styled from './Step.styled';

export interface StepPropsInterface {
  icon?: IconNameType;
  label?: string;
  size?: 'normal';
  variant?: 'active' | 'next' | 'prev';
}

const Step: FC<StepPropsInterface> = ({icon, label, variant = 'active', size = 'normal'}) => {
  return (
    <styled.Round data-testid="Step-test" className={cn(variant, size)}>
      {icon && <IconSvg name={icon} size="m" isWhite />}
      {label && <>{label}</>}
    </styled.Round>
  );
};

export default memo(Step);
