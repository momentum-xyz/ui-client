import {FC, memo, PropsWithChildren} from 'react';
import cn from 'classnames';

import * as styled from './Hexagon.styled';

type HexagonSizeType = 'small' | 'normal' | 'large';
type HexagonType = 'primary' | 'secondary' | 'third' | 'fourth' | 'blank';

export interface HexagonPropsInterface {
  type: HexagonType;
  isActive?: boolean;
  noBorder?: boolean;
  noHover?: boolean;
  skipOuterBorder?: boolean;
  margin?: number;
  onClick?: () => void;
}

const Hexagon: FC<PropsWithChildren<HexagonPropsInterface>> = (props) => {
  const {
    type = 'primary',
    isActive,
    noBorder,
    noHover,
    skipOuterBorder,
    onClick,
    children,
    margin,
    ...rest
  } = props;
  const size: HexagonSizeType = ['primary', 'secondary'].includes(type)
    ? 'large'
    : type === 'third'
    ? 'small'
    : 'normal';

  const isOuterBorder = !skipOuterBorder && type === 'primary';
  const showSparkle = isOuterBorder && isActive;
  const isBlank = type === 'blank';

  return (
    <styled.Wrapper
      data-testid="Hexagon-test"
      className={cn('hexagon-wrapper', size, isBlank && 'blank', isOuterBorder && 'outer-border')}
      style={margin ? {margin: `${margin}px`} : {}}
      {...rest}
    >
      {showSparkle && (
        <styled.Sparkle
          width="32"
          height="64"
          viewBox="0 0 32 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.2051 29.5485L17.2596 31.6031C25.5074 31.6191 32 31.7915 32 32.0019C32 32.2122 25.5058 32.3846 17.2565 32.4007L15.2051 34.4521C15.1894 50.9795 15.0169 64 14.8062 64C14.5955 64 14.4228 50.9562 14.4074 34.4077L12.3913 32.3916C5.29274 32.3507 0 32.1918 0 32.0019C0 31.812 5.29118 31.653 12.3882 31.6121L14.4074 29.5929C14.4227 13.0441 14.5955 0 14.8062 0C15.0169 0 15.1894 13.0208 15.2051 29.5485Z"
            fill="url(#paint0_radial_2334_50110)"
          />
          <defs>
            <radialGradient
              id="paint0_radial_2334_50110"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(16 32) rotate(90) scale(32 16)"
            >
              <stop stop-color="white" />
              <stop offset="1" stop-color="white" stop-opacity="0.4" />
            </radialGradient>
          </defs>
        </styled.Sparkle>
      )}

      <styled.Hexagon
        className={cn(
          'hexagon',
          size,
          (noHover || (noBorder && !isOuterBorder)) && 'no-hover',
          noBorder && 'borderless',
          isOuterBorder && 'outer-border',
          isBlank && 'blank',
          isActive && !skipOuterBorder && 'active'
        )}
      >
        {isOuterBorder ? (
          <>
            <Hexagon
              type={type}
              skipOuterBorder={true}
              noBorder={noBorder}
              noHover={noHover}
              isActive={isActive}
              onClick={onClick}
            >
              {children}
            </Hexagon>
          </>
        ) : (
          <>{!isBlank && children}</>
        )}
      </styled.Hexagon>
    </styled.Wrapper>
  );
};

export default memo(Hexagon);
