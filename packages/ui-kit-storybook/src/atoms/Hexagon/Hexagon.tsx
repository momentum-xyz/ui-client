import {FC, memo, PropsWithChildren} from 'react';
import cn from 'classnames';

import * as styled from './Hexagon.styled';

type HexagonSizeType = 'small' | 'normal' | 'large';

export interface HexagonPropsInterface {
  size?: HexagonSizeType;
  isBlank?: boolean;
  isBlueBorder?: boolean;
  isBordered?: boolean;
  onClick?: () => void;
  className?: string;
}

const Hexagon: FC<PropsWithChildren<HexagonPropsInterface>> = (props) => {
  const {
    size = 'normal',
    isBlank,
    isBordered,
    isBlueBorder,
    className,
    onClick,
    children,
    ...rest
  } = props;
  return (
    <styled.Wrapper data-testid="Hexagon-test" {...rest}>
      <styled.Hexagon
        className={cn(
          size,
          isBordered && 'border',
          isBlueBorder && 'blue-border',
          isBlank && 'blank',
          className
        )}
      >
        {isBordered ? (
          <Hexagon
            size={size}
            className={className}
            isBlank={isBlank}
            isBlueBorder={isBlueBorder}
            onClick={onClick}
          >
            {children}
          </Hexagon>
        ) : (
          children
        )}
      </styled.Hexagon>
    </styled.Wrapper>
  );
};

export default memo(Hexagon);
