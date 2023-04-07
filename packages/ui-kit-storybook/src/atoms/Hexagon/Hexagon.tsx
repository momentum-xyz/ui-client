import {FC, memo} from 'react';
import cn from 'classnames';

import Sparkle from '../../static/images/sparkle.svg';
import {IconSvg} from '../IconSvg';
import {IconNameType} from '../../types';
import {IconSizeType} from '../IconSvg/IconSvg';

import * as styled from './Hexagon.styled';

type HexagonSizeType = 'small' | 'normal' | 'medium' | 'large';
type HexagonType =
  | 'primary'
  | 'primary-borderless'
  | 'secondary'
  | 'secondary-borderless'
  | 'third'
  | 'third-borderless'
  | 'fourth'
  | 'fourth-borderless'
  | 'fifth'
  | 'fifth-borderless'
  | 'blank-borderless'
  | 'blank';

const largeSizeHexagonTypes: HexagonType[] = [
  'primary',
  'primary-borderless',
  'secondary',
  'secondary-borderless'
];
const mediumSizeHexagonTypes: HexagonType[] = ['fourth', 'fourth-borderless'];
const smallSizeHexagonTypes: HexagonType[] = ['fifth', 'fifth-borderless'];

const blankHexagonTypes: HexagonType[] = ['blank', 'blank-borderless'];

const borderlessHexagonTypes: HexagonType[] = [
  'primary-borderless',
  'secondary-borderless',
  'third-borderless',
  'fourth-borderless',
  'fifth-borderless',
  'blank-borderless'
];

type HexagonColorType = 'normal' | 'success' | 'danger';

const hexagonSizeIconSizeMap: {[key in HexagonSizeType]: IconSizeType} = {
  small: 'm',
  normal: 'm',
  medium: 'm',
  large: 'xl'
};

export interface HexagonPropsInterface {
  type: HexagonType;
  color?: HexagonColorType;
  isActive?: boolean;
  noHover?: boolean;
  skipOuterBorder?: boolean;
  transparentBackground?: boolean;
  margin?: number;
  imageSrc?: string | null;
  iconName?: IconNameType;
  onClick?: () => void;
}

const Hexagon: FC<HexagonPropsInterface> = (props) => {
  const {
    type = 'primary',
    color = 'normal',
    isActive,
    noHover,
    skipOuterBorder,
    transparentBackground = false,
    iconName,
    imageSrc,
    onClick,
    margin,
    ...rest
  } = props;

  const isBorderless = borderlessHexagonTypes.includes(type);

  const size: HexagonSizeType = largeSizeHexagonTypes.includes(type)
    ? 'large'
    : mediumSizeHexagonTypes.includes(type)
    ? 'medium'
    : smallSizeHexagonTypes.includes(type)
    ? 'small'
    : 'normal';

  const isOuterBorder = !skipOuterBorder && type === 'primary';
  const showSparkle = isOuterBorder && isActive;
  const isBlank = blankHexagonTypes.includes(type);
  const shouldHaveButton =
    type !== 'blank' && type !== 'blank-borderless' && !(type === 'primary' && skipOuterBorder);

  const iconSize = hexagonSizeIconSizeMap[size];
  const element = imageSrc ? (
    <img src={imageSrc} alt="" style={{height: '100%'}} />
  ) : iconName ? (
    <IconSvg name={iconName} size={iconSize} isWhite />
  ) : (
    <></>
  );

  const hexElement = (
    <styled.Wrapper
      data-testid="Hexagon-test"
      className={cn(
        'hexagon-wrapper',
        size,
        isBlank && 'blank',
        noHover && 'no-hover',
        isOuterBorder && 'outer-border'
      )}
      onClick={() => {
        onClick?.();
      }}
      style={margin ? {margin: `${margin}px`} : {}}
      {...rest}
    >
      {showSparkle && <styled.Sparkle src={Sparkle} alt="sparkle" />}

      <styled.Hexagon
        className={cn(
          'hexagon',
          size,
          `${color}-color`,
          transparentBackground && 'transparent-background',
          (noHover || (isBorderless && !isOuterBorder)) && 'no-hover',
          isBorderless && 'borderless',
          isOuterBorder && 'outer-border',
          isBlank && 'blank',
          isActive && !isOuterBorder && 'active',
          iconName && 'icon-hexagon'
        )}
      >
        {isOuterBorder ? (
          <>
            <Hexagon
              type={type}
              skipOuterBorder={true}
              noHover={noHover}
              isActive={isActive}
              iconName={iconName}
              imageSrc={imageSrc}
            />
          </>
        ) : (
          <>{!isBlank && element}</>
        )}
      </styled.Hexagon>
    </styled.Wrapper>
  );

  return (
    <>{shouldHaveButton ? <styled.WrapperButton>{hexElement}</styled.WrapperButton> : hexElement}</>
  );
};

export default memo(Hexagon);
