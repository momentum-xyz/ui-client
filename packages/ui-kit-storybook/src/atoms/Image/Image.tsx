import {FC, useState} from 'react';

import * as styled from './Image.styled';

export interface ImagePropsInterface {
  src?: string | null;
  height?: number;
}

const Image: FC<ImagePropsInterface> = ({src, height = 124}) => {
  const [isError, setIsError] = useState<boolean>(false);

  return (
    <styled.Container height={height} data-testid="Image-test">
      {src && !isError ? (
        <styled.Image src={src} onError={() => setIsError(true)} />
      ) : (
        <styled.ErroredImage />
      )}
    </styled.Container>
  );
};

export default Image;
