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
  isDisabled?: boolean;
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
  isDisabled,
  onClick
}) => {
  const [isError, setIsError] = useState<boolean>(false);

  return (
    <styled.Container
      height={height}
      data-testid="Image-test"
      onClick={onClick}
      className={cn(bordered && 'bordered')}
    >
      {src && !isError ? (
        <styled.Image
          src={src}
          onError={() => setIsError(true)}
          className={cn(isDisabled && 'disabled')}
        />
      ) : (
        <styled.ErrorContainer className={cn(isDisabled && 'disabled')}>
          <styled.Error errorIconOffset={errorIconOffset} className={cn(isIconAccent && 'accent')}>
            <Hexagon
              type="secondary-borderless"
              iconName={errorIcon}
              isDisabled={isDisabled}
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
