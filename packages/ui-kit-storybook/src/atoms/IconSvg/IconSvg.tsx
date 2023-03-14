import {FC, memo} from 'react';
import cn from 'classnames';

import {PropsWithThemeInterface} from '../../interfaces';
import {IconNameType} from '../../types';

import * as styled from './IconSvg.styled';

const svgModules = require.context('../../assets/svg-sprite', false, /\.svg$/);
const svgSpritePath: string = svgModules(svgModules.keys()[0]);

export type IconSizeType = 'xl' | 'l' | 'm' | 's' | 'xs' | 'xxs';

export interface IconSvgPropsInterface extends PropsWithThemeInterface {
  name: IconNameType;
  size?: IconSizeType;
  isWhite?: boolean;
  onClick?: () => void;
  isDanger?: boolean;
  isDisabled?: boolean;
  className?: string;
}

const IconSvg: FC<IconSvgPropsInterface> = (props) => {
  const {name, size = 'm', isWhite, isDanger, isDisabled, className, ...rest} = props;
  return (
    <styled.Wrapper
      data-testid="IconSvg-test"
      {...rest}
      className={cn(
        size,
        isWhite && 'white',
        isDanger && 'danger',
        isDisabled && 'disabled',
        className
      )}
    >
      <styled.Svg>
        <use xlinkHref={`${svgSpritePath}#${name as string}`} />
      </styled.Svg>
    </styled.Wrapper>
  );
};

export default memo(IconSvg);
