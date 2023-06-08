import {FC, memo} from 'react';
import cn from 'classnames';

import Sparkle from '../../static/images/sparkle.svg';
import {IconSvg} from '../IconSvg';
import {IconNameType} from '../../types';
import {IconSizeType} from '../IconSvg/IconSvg';
import {Image} from '../Image';
import {Tooltip} from '../Tooltip';

import * as styled from './Hexagon.styled';

export interface HexagonSizesInterface {
  large: {w: number; h: number};
  normal: {w: number; h: number};
  mediumLarge: {w: number; h: number};
  medium: {w: number; h: number};
  small: {w: number; h: number};
  smallBlank: {w: number; h: number};
  borderLarge: {w: number; h: number};
  borderSmall: {w: number; h: number};
}
const hexagonSizes: HexagonSizesInterface = {
  large: {w: 48, h: 56},
  normal: {w: 42, h: 49},
  mediumLarge: {w: 38, h: 44},
  medium: {w: 36, h: 42},
  small: {w: 30, h: 35},
  smallBlank: {w: 28, h: 33},
  borderLarge: {w: 60, h: 68},
  borderSmall: {w: 48, h: 56}
};

type HexagonSizeType = 'small' | 'normal' | 'medium' | 'large';
type HexagonType =
  | 'menu'
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
  | 'blank'
  | 'blank-small-borderless'
  | 'blank-small';

const largeSizeHexagonTypes: HexagonType[] = [
  'primary',
  'primary-borderless',
  'secondary',
  'secondary-borderless'
];
const mediumSizeHexagonTypes: HexagonType[] = ['fourth', 'fourth-borderless'];
const smallSizeHexagonTypes: HexagonType[] = [
  'fifth',
  'fifth-borderless',
  'blank-small',
  'blank-small-borderless'
];

const blankHexagonTypes: HexagonType[] = [
  'blank',
  'blank-borderless',
  'blank-small',
  'blank-small-borderless'
];

const outerBorderTypes: HexagonType[] = ['primary', 'menu'];

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

export type HexagonIndicatorType = 'voice';

export interface HexagonPropsInterface {
  type: HexagonType;
  color?: HexagonColorType;
  indicator?: HexagonIndicatorType;
  isActive?: boolean;
  noHover?: boolean;
  skipOuterBorder?: boolean;
  transparentBackground?: boolean;
  margin?: number;
  tooltip?: string | null;
  imageSrc?: string | null;
  iconName?: IconNameType | null;
  label?: string;
  noButton?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
}

const Hexagon: FC<HexagonPropsInterface> = (props) => {
  const {
    type = 'primary',
    color = 'normal',
    indicator,
    isActive,
    noHover,
    skipOuterBorder,
    transparentBackground = false,
    iconName,
    imageSrc,
    label,
    margin,
    tooltip,
    noButton,
    isDisabled,
    onClick,
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

  const isOuterBorder = !skipOuterBorder && outerBorderTypes.includes(type);
  const showSparkle = isOuterBorder && isActive;
  const isBlank = blankHexagonTypes.includes(type);
  const isMenu = type === 'menu';
  const shouldHaveButton =
    type !== 'blank' &&
    type !== 'blank-borderless' &&
    !((type === 'primary' || isMenu) && skipOuterBorder) &&
    !noButton;

  const hexElementHeight = isBlank
    ? size === 'small'
      ? hexagonSizes.smallBlank.h
      : hexagonSizes.medium.h
    : isOuterBorder
    ? isMenu
      ? hexagonSizes.borderSmall.h
      : hexagonSizes.borderLarge.h
    : isMenu
    ? hexagonSizes.mediumLarge.h
    : hexagonSizes[size].h;

  const iconSize = hexagonSizeIconSizeMap[size];
  const element = imageSrc ? (
    <Image src={imageSrc} height={hexElementHeight} errorIcon={iconName} isDisabled={isDisabled} />
  ) : iconName ? (
    <IconSvg name={iconName} size={iconSize} isWhite />
  ) : (
    <styled.Label>{label}</styled.Label>
  );

  const hexElement = (
    <styled.Wrapper
      data-testid="Hexagon-test"
      {...hexagonSizes}
      className={cn(
        'hexagon-wrapper',
        size,
        isMenu && 'menu',
        isBlank && 'blank',
        noHover && 'no-hover',
        isOuterBorder && 'outer-border',
        isDisabled && 'disabled'
      )}
      onClick={() => {
        onClick?.();
      }}
      style={margin ? {margin: `${margin}px`} : {}}
      {...rest}
    >
      {showSparkle && (
        <styled.Sparkle src={Sparkle} alt="sparkle" className={cn(isMenu && 'menu')} />
      )}

      {indicator === 'voice' && (
        <styled.IndicatorVoice>
          <IconSvg name="talk" size="xxs" isWhite />
        </styled.IndicatorVoice>
      )}

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
          isMenu && 'menu',
          isActive && !isOuterBorder && 'active',
          iconName && 'icon-hexagon',
          isDisabled && 'disabled'
        )}
      >
        {isOuterBorder ? (
          <>
            <Hexagon
              type={type}
              skipOuterBorder={true}
              noHover={noHover}
              isActive={isActive}
              isDisabled={isDisabled}
              iconName={iconName}
              imageSrc={imageSrc}
              label={label}
            />
          </>
        ) : (
          <>{!isBlank && element}</>
        )}
      </styled.Hexagon>
    </styled.Wrapper>
  );

  const hexElementWithTooltip = tooltip ? (
    <Tooltip text={tooltip}>{hexElement}</Tooltip>
  ) : (
    hexElement
  );

  return (
    <>
      {shouldHaveButton ? (
        <styled.WrapperButton className={cn(isDisabled && 'disabled')}>
          {hexElementWithTooltip}
        </styled.WrapperButton>
      ) : (
        hexElementWithTooltip
      )}
    </>
  );
};

export default memo(Hexagon);
