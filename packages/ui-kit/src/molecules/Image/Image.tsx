import React, {FC, memo, useState} from 'react';
import cn from 'classnames';

import {PropsWithThemeInterface} from '../../interfaces';
import {SizeType} from '../../types';

import * as styled from './Image.styled';

interface PropsInterface extends PropsWithThemeInterface {
  src?: string;
  size: SizeType;
  onClick?: () => void;
  className?: string;
  isLoading?: boolean;
  isError?: boolean;
}

const Avatar: FC<PropsInterface> = ({
  src,
  size,
  className,
  onClick,
  isLoading = false,
  isError = false
}) => {
  const [error, setError] = useState(isError);

  return (
    <styled.Container
      data-testid="Image-test"
      className={cn(size, isLoading && 'loading', isError && 'error', className)}
      onClick={onClick}
    >
      {isLoading ? (
        <div>(spinner)</div>
      ) : (
        <>
          {src && !error ? (
            <styled.ImageWrapper>
              <styled.Image src={src} alt={src} onError={() => setError(true)} />
            </styled.ImageWrapper>
          ) : (
            <div>(error)</div>
          )}
        </>
      )}
    </styled.Container>
  );
};

export default memo(Avatar);

{
  /* <styled.ImageWrapper>
  <styled.Image src={src} alt={src} onError={() => setError(true)} />
</styled.ImageWrapper> */
}
