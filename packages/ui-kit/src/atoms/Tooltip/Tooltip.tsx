import {createRef, FC, memo, PropsWithChildren, useState} from 'react';
import cn from 'classnames';

import * as styled from './Tooltip.styled';

type TooltipPlacementType = 'left' | 'right';

export interface TooltipPropsInterface {
  text?: string;
}

const Tooltip: FC<PropsWithChildren<TooltipPropsInterface>> = ({text, children}) => {
  const [isShown, setIsShown] = useState(false);
  const [innerPlacement, setInnerPlacement] = useState<TooltipPlacementType>('right');

  const divRef = createRef<HTMLDivElement>();
  const tooltipRef = createRef<HTMLDivElement>();

  const show = () => {
    const div = divRef.current;
    const tooltip = tooltipRef.current;
    if (!div || !tooltip) {
      return;
    }

    const divBoundingRect = div.getBoundingClientRect();

    const tooltipStartX = div.clientWidth + divBoundingRect.x;
    const tooltipLength = tooltip.clientWidth;

    if (innerPlacement === 'right') {
      const tooltipEnd = tooltipStartX + tooltipLength;
      const overflows = tooltipEnd > window.innerWidth;
      if (overflows) {
        setInnerPlacement('left');
      }
    } else {
      const tooltipEnd = tooltipStartX - tooltipLength;
      const overflows = tooltipEnd < 0;
      if (overflows) {
        setInnerPlacement('right');
      }
    }

    setIsShown(true);
  };

  return (
    <styled.Wrapper>
      <styled.Tooltip ref={tooltipRef} className={cn(text && isShown && 'visible', innerPlacement)}>
        {text}
      </styled.Tooltip>
      <div
        ref={divRef}
        onMouseEnter={() => show()}
        onMouseLeave={() => {
          setIsShown(false);
        }}
      >
        {children}
      </div>
    </styled.Wrapper>
  );
};

export default memo(Tooltip);
