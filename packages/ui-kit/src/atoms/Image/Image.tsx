import {FC, useState} from 'react';
import cn from 'classnames';

import {Hexagon} from '../Hexagon';
import {IconNameType} from '../../types';

import * as styled from './Image.styled';

export interface ImagePropsInterface {
  src?: string | null;
  height?: number;
  errorIcon?: IconNameType | null;
  errorIconOffset?: number;
  isIconAccent?: boolean;
  bordered?: boolean;
  onClick?: () => void;
}

const Image: FC<ImagePropsInterface> = ({
  src,
  height = 124,
  errorIcon = 'rabbit_fill',
  errorIconOffset = 0,
  isIconAccent,
  bordered,
  onClick
}) => {
  const [isError, setIsError] = useState<boolean>(false);

  return (
    <styled.Container
      className={cn(bordered && 'bordered')}
      height={height}
      data-testid="Image-test"
      onClick={onClick}
    >
      {src && !isError ? (
        <styled.Image src={src} onError={() => setIsError(true)} />
      ) : (
        <styled.ErrorContainer>
          <styled.Error errorIconOffset={errorIconOffset} className={cn(isIconAccent && 'accent')}>
            <Hexagon
              type="secondary-borderless"
              iconName={errorIcon}
              noHover
              skipOuterBorder
              noButton
            />
          </styled.Error>
        </styled.ErrorContainer>
      )}
    </styled.Container>
  );
};

export default Image;
