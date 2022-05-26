import React, {ReactNode, useCallback, useEffect} from 'react';
import {createPortal} from 'react-dom';

export interface ToolTipProps {
  label: string;
  direction?: 'top' | 'left' | 'right' | 'bottom';
  className?: string;
}

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const tooltipElement = document.getElementById('tooltip-container');

type TooltipPortalProps = {children: ReactNode};
const TooltipPortal = ({children}: TooltipPortalProps) =>
  tooltipElement ? createPortal(children, tooltipElement) : null;

const settings = {
  top: {
    opposite: 'bottom',
    chevron: {
      borderLeft: '10px solid transparent',
      borderRight: '10px solid transparent',
      borderTop: '10px solid rgba(32, 42, 68, .8)'
    },
    chevronPos: 'left-1/2 top-full transform -translate-x-1/2',
    positioning: 'left-1/2 transform -translate-x-1/2 px-1 py-.5 '
  },
  left: {
    opposite: 'right',
    chevron: {
      borderBottom: '10px solid transparent',
      borderTop: '10px solid transparent',
      borderLeft: '10px solid rgba(32, 42, 68, .8)'
    },
    chevronPos: 'top-1/2 left-full transform -translate-y-1/2',
    positioning: 'top-1/2 transform -translate-y-1/2 px-1 py-.5 '
  },
  right: {
    opposite: 'left',
    chevron: {
      borderBottom: '10px solid transparent',
      borderTop: '10px solid transparent',
      borderRight: '10px solid rgba(32, 42, 68, .8)'
    },
    chevronPos: 'top-1/2 right-full transform -translate-y-1/2',
    positioning: 'top-1/2 transform -translate-y-1/2 px-1 py-.5 '
  },
  bottom: {
    opposite: 'top',
    chevron: {
      borderLeft: '10px solid transparent',
      borderRight: '10px solid transparent',
      borderBottom: '10px solid rgba(32, 42, 68, .8)'
    },
    chevronPos: 'left-1/2 bottom-full transform -translate-x-1/2',
    positioning: 'left-1/2 transform -translate-x-1/2 px-1 py-.5'
  }
};

const Tooltip: React.FC<ToolTipProps> = ({children, className, label, direction = 'top'}) => {
  const tipRef = React.createRef<HTMLDivElement>();
  const holdRef = React.createRef<HTMLDivElement>();

  const setPosition = useCallback(() => {
    const refStyle = tipRef?.current?.style;
    const boundingRect = holdRef.current?.getBoundingClientRect();
    if (refStyle && boundingRect) {
      switch (direction) {
        case 'bottom':
          refStyle.top = `${boundingRect.bottom}px`;
          refStyle.left = `${boundingRect.left + boundingRect.width / 2}px`;
          break;
        case 'top':
          refStyle.bottom = `${window.innerHeight - boundingRect.top}px`;
          refStyle.left = `${boundingRect.left + boundingRect.width / 2}px`;
          break;
        case 'left':
          refStyle.top = `${boundingRect.top + boundingRect.height / 2}px`;
          refStyle.left = `${boundingRect.left}px`;
          break;
        case 'right':
          refStyle.top = `${boundingRect.top + boundingRect.height / 2}px`;
          refStyle.left = `${boundingRect.right}px`;
          break;
      }
    }
  }, [direction, holdRef, tipRef]);

  function handleMouseEnter() {
    const refStyle = tipRef?.current?.style;
    if (refStyle) {
      refStyle.opacity = '1';
      // @ts-ignore
      refStyle[`margin${capitalize(settings[direction].opposite)}`] = '20px';
    }
    setPosition();
  }

  function handleMouseLeave() {
    const refStyle = tipRef?.current?.style;
    if (refStyle) {
      refStyle.opacity = '0';
      // @ts-ignore
      refStyle[`margin${capitalize(settings[direction].opposite)}`] = '10px';
    }
  }

  useEffect(() => {
    setPosition();
  }, [setPosition]);

  return (
    <div
      className={`relative flex items-center ${className as string}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={holdRef}
    >
      <TooltipPortal>
        <div
          className={`${settings[direction].positioning} whitespace-nowrap fixed bg-dark-blue-80 text-white rounded flex items-center transition-all duration-150 pointer-events-none`}
          style={{opacity: 0}}
          ref={tipRef}
        >
          <div
            className={`${settings[direction].chevronPos} absolute`}
            style={{
              ...settings[direction].chevron
            }}
          />
          {label}
        </div>
      </TooltipPortal>
      {children}
    </div>
  );
};

export default Tooltip;
