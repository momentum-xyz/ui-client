import cn from 'classnames';
import {FC, memo, PropsWithChildren, useState} from 'react';

import * as styled from './Tooltip.styled';

type TooltipPlacementType = 'left' | 'right';

export interface TooltipPropsInterface {
  text?: string;
  placement: TooltipPlacementType;
}

const Tooltip: FC<PropsWithChildren<TooltipPropsInterface>> = ({
  text,
  placement = 'right',
  children
}) => {
  const [show, setShow] = useState(false);

  return (
    <styled.Wrapper>
      <styled.Tooltip className={cn(text && show && 'visible', placement)}>{text}</styled.Tooltip>
      <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
        {children}
      </div>
    </styled.Wrapper>
  );
};

export default memo(Tooltip);
