import React, {FC, memo, useEffect, useState} from 'react';
import cn from 'classnames';
import defaultLoaderPlaceholder from 'static/images/spinner.svg';
import defaultErrorPlaceholder from 'static/images/astronaut.svg';

import {ComponentSizeInterface} from 'interfaces';

import * as styled from './Image.styled';

interface PropsInterface {
  src?: string;
  isLoading?: boolean;
  isError?: boolean;
  sizeProps?: ComponentSizeInterface;
  className?: string;
  errorPlaceholder?: string;
  loaderPlaceholder?: string;
}

const Image: FC<PropsInterface> = (props) => {
  const {
    src,
    sizeProps,
    className,
    isLoading = false,
    isError = false,
    errorPlaceholder = defaultErrorPlaceholder,
    loaderPlaceholder = defaultLoaderPlaceholder
  } = props;

  const [error, setError] = useState(isError);
  useEffect(() => setError(isError), [src]);

  return (
    <styled.Container
      data-testid="Image-test"
      className={cn(`${className}-container`)}
      {...sizeProps}
    >
      {isLoading ? (
        <styled.Loader className={cn(`${className}-loader`)} src={loaderPlaceholder} />
      ) : (
        <>
          {src && !error ? (
            <styled.Image
              src={src}
              alt={src}
              className={cn(className)}
              onError={() => setError(true)}
            />
          ) : (
            <styled.ErroredImage className={cn(`${className}-error`)} src={errorPlaceholder} />
          )}
        </>
      )}
    </styled.Container>
  );
};

export default memo(Image);
