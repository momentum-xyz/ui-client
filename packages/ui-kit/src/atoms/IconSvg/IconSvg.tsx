import React, {FC, memo} from 'react';
import cn from 'classnames';

import {PropsWithThemeInterface} from '../../interfaces';
import {SizeType, IconNameType} from '../../types';

import * as styled from './IconSvg.styled';

// FIXME: Relative path doesn't work in the test file.
const svgModules = require.context('../../assets/svg-sprite', false, /\.svg$/);
const svgSpritePath: string = svgModules(svgModules.keys()[0]);

export interface IconSvgPropsInterface extends PropsWithThemeInterface {
  name: IconNameType;
  size?: SizeType;
  isWhite?: boolean;
  onClick?: () => void;
  isDanger?: boolean;
  className?: string;
}

const IconSvg: FC<IconSvgPropsInterface> = (props) => {
  const {name, size = 'normal', isWhite = false, isDanger = false, className, ...rest} = props;
  return (
    <styled.Wrapper
      data-testid="IconSvg-test"
      {...rest}
      className={cn(size, isWhite && 'white', isDanger && 'danger', className)}
    >
      <styled.Svg>
        <use xlinkHref={`${svgSpritePath}#${name as string}`} />
      </styled.Svg>
    </styled.Wrapper>
  );
};

export default memo(IconSvg);
