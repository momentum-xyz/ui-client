import React, {FC, memo} from 'react';
import requireContext from 'require-context.macro';
import cn from 'classnames';
import {PropsWithThemeInterface} from '@momentum/ui-kit';
import {SizeType} from 'ui-kit/types';

import * as styled from './IconSvg.styled';

// FIXME: Relative path doesn't work in the test file.
const svgModules = requireContext('../../../ui-kit/assets/svg-sprite', false, /\.svg$/);
const svgSpritePath: string = svgModules(svgModules.keys()[0]);

interface IconSvgPropsInterface extends PropsWithThemeInterface {
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
