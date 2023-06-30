import {FC, memo} from 'react';
import cn from 'classnames';

import {PropsWithThemeInterface} from '../../interfaces';
import {IconNameType} from '../../types';

import * as styled from './IconSvg.styled';

const svgModules = require.context('../../assets/svg-sprite', false, /\.svg$/);
const svgSpritePath: string = svgModules(svgModules.keys()[0]);

export type IconSizeType = 'xxl' | 'xll' | 'xl2' | 'xl' | 'l' | 'm' | 's' | 'xs' | 'xxs';

export interface IconSvgPropsInterface extends PropsWithThemeInterface {
  name: IconNameType;
  size?: IconSizeType;
  isWhite?: boolean;
  onClick?: () => void;
  isDanger?: boolean;
  isAccent?: boolean;
  isDisabled?: boolean;
}

const IconSvg: FC<IconSvgPropsInterface> = (props) => {
  const {name, size = 'm', isWhite, isAccent, isDanger, isDisabled, ...rest} = props;
  return (
    <styled.Wrapper
      data-testid="IconSvg-test"
      {...rest}
      className={cn(
        size,
        isWhite && 'white',
        isDanger && 'danger',
        isAccent && 'accent',
        isDisabled && 'disabled'
      )}
    >
      <styled.Svg>
        <use xlinkHref={`${svgSpritePath}#${name as string}`} />
      </styled.Svg>
    </styled.Wrapper>
  );
};

export default memo(IconSvg);
