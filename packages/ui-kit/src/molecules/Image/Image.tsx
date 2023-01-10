import React, {FC, memo, useEffect, useState} from 'react';

import defaultLoaderPlaceholder from '../../static/images/spinner.svg';
import {ComponentSizeInterface} from '../../interfaces';

import * as styled from './Image.styled';

interface PropsInterface {
  src?: string;
  isLoading?: boolean;
  isError?: boolean;
  sizeProps?: ComponentSizeInterface;
  className?: string;
  loaderPlaceholder?: string;
}

const Image: FC<PropsInterface> = (props) => {
  const {
    src,
    sizeProps,
    isLoading = false,
    isError = false,
    loaderPlaceholder = defaultLoaderPlaceholder
  } = props;

  const [error, setError] = useState(isError);
  useEffect(() => setError(isError), [src]);

  return (
    <styled.Container data-testid="Image-test" className="image-container" {...sizeProps}>
      {isLoading ? (
        <styled.Loader className="image-loader" src={loaderPlaceholder} />
      ) : (
        <>
          {src && !error ? (
            <styled.Image src={src} alt={src} className="image" onError={() => setError(true)} />
          ) : (
            <styled.ErroredImage className="image-error" />
          )}
        </>
      )}
    </styled.Container>
  );
};

export default memo(Image);
