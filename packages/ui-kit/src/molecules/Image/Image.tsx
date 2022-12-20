import React, {FC, memo, useEffect, useState} from 'react';

import defaultLoaderPlaceholder from '../../static/images/spinner.svg';
import defaultErrorPlaceholder from '../../static/images/astronaut.svg';
import {ComponentSizeInterface} from '../../interfaces';

import defaultErrorPlaceholder from '../../assets/images/common/astronaut.svg';
import defaultLoaderPlaceholder from '../../assets/images/common/spinner.svg';

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
    isLoading = false,
    isError = false,
    errorPlaceholder = defaultErrorPlaceholder,
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
            <styled.ErroredImage className="image-error" src={errorPlaceholder} />
          )}
        </>
      )}
    </styled.Container>
  );
};

export default memo(Image);
