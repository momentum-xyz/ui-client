import {FC, memo, PropsWithChildren} from 'react';
import cn from 'classnames';

import Sparkle from '../../assets/icons/sparkle.svg';

import * as styled from './Hexagon.styled';

type HexagonSizeType = 'small' | 'normal' | 'large';
type HexagonType =
  | 'primary'
  | 'primary-borderless'
  | 'secondary'
  | 'secondary-borderless'
  | 'third'
  | 'third-borderless'
  | 'fourth'
  | 'fourth-borderless'
  | 'blank-borderless'
  | 'blank';

const largeSizeHexagonTypes: HexagonType[] = [
  'primary',
  'primary-borderless',
  'secondary',
  'secondary-borderless'
];
const smallSizeHexagonTypes: HexagonType[] = ['fourth', 'fourth-borderless'];

const borderlessHexagonTypes: HexagonType[] = [
  'primary-borderless',
  'secondary-borderless',
  'third-borderless',
  'fourth-borderless',
  'blank-borderless'
];

export interface HexagonPropsInterface {
  type: HexagonType;
  isActive?: boolean;
  noHover?: boolean;
  skipOuterBorder?: boolean;
  margin?: number;
  onClick?: () => void;
}

const Hexagon: FC<PropsWithChildren<HexagonPropsInterface>> = (props) => {
  const {
    type = 'primary',
    isActive,
    noHover,
    skipOuterBorder,
    onClick,
    children,
    margin,
    ...rest
  } = props;

  const isBorderless = borderlessHexagonTypes.includes(type);

  const size: HexagonSizeType = largeSizeHexagonTypes.includes(type)
    ? 'large'
    : smallSizeHexagonTypes.includes(type)
    ? 'small'
    : 'normal';

  const isOuterBorder = !skipOuterBorder && type === 'primary';
  const showSparkle = isOuterBorder && isActive;
  const isBlank = type === 'blank';

  const clickHandler = onClick || (() => {});

  return (
    <styled.Wrapper
      data-testid="Hexagon-test"
      className={cn(
        'hexagon-wrapper',
        size,
        isBlank && 'blank',
        noHover && 'no-hover',
        isOuterBorder && 'outer-border'
      )}
      onClick={clickHandler}
      style={margin ? {margin: `${margin}px`} : {}}
      {...rest}
    >
      {showSparkle && <styled.Sparkle src={Sparkle} alt="sparkle" />}

      <styled.Hexagon
        className={cn(
          'hexagon',
          size,
          (noHover || (isBorderless && !isOuterBorder)) && 'no-hover',
          isBorderless && 'borderless',
          isOuterBorder && 'outer-border',
          isBlank && 'blank',
          isActive && !skipOuterBorder && 'active'
        )}
      >
        {isOuterBorder ? (
          <>
            <Hexagon type={type} skipOuterBorder={true} noHover={noHover} isActive={isActive}>
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
