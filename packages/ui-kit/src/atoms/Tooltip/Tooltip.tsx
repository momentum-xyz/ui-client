import RcTooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
import React, {FC, ReactNode} from 'react';
import cn from 'classnames';

import {PropsWithThemeInterface, ComponentSizeInterface} from '../../interfaces';
import {PlacementType} from '../../types';

import * as styled from './Tooltip.styled';

interface PropsInterface extends PropsWithThemeInterface {
  label: string | ReactNode;
  placement?: PlacementType;
  visible?: boolean;
  darkBackground?: boolean;
  size?: ComponentSizeInterface;
  children?: ReactNode;
}

const ENTER_DELAY_DEFAULT = 0.1;
const LEAVE_DELAY_DEFAULT = 0.1;

const Tooltip: FC<PropsInterface> = ({
  label,
  placement,
  visible = true,
  children,
  darkBackground = false,
  size
}) => {
  const divRef = React.createRef<any>();

  const getTooltipContainer = () => divRef.current;
  return (
    <>
      {visible ? (
        <styled.Div
          data-testid="Tooltip-test"
          ref={divRef}
          className={cn(darkBackground && 'darkBackground')}
        >
          <RcTooltip
            overlay={<span>{label}</span>}
            overlayStyle={{...size}}
            placement={placement}
            mouseEnterDelay={ENTER_DELAY_DEFAULT}
            mouseLeaveDelay={LEAVE_DELAY_DEFAULT}
            getTooltipContainer={getTooltipContainer}
          >
            <div>{children}</div>
          </RcTooltip>
        </styled.Div>
      ) : (
        <div>{children}</div>
      )}
    </>
  );
};

export default Tooltip;
