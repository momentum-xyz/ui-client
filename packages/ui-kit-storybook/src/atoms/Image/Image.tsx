import {FC, useState} from 'react';

import {Hexagon} from '../Hexagon';
import {IconNameType} from '../../types';

import * as styled from './Image.styled';

export interface ImagePropsInterface {
  src?: string | null;
  height?: number;
  errorIcon?: IconNameType;
  errorIconOffset?: number;
  onClick?: () => void;
}

const Image: FC<ImagePropsInterface> = ({
  src,
  height = 124,
  errorIcon = 'rabbit_fill',
  errorIconOffset = 0,
  onClick
}) => {
  const [isError, setIsError] = useState<boolean>(false);

  return (
    <styled.Container height={height} data-testid="Image-test" onClick={onClick}>
      {src && !isError ? (
        <styled.Image src={src} onError={() => setIsError(true)} />
      ) : (
        <styled.ErroredImage errorIconOffset={errorIconOffset}>
          <Hexagon type="secondary" iconName={errorIcon} noHover skipOuterBorder />
        </styled.ErroredImage>
      )}
    </styled.Container>
  );
};

export default Image;
