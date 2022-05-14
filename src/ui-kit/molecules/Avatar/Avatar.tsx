import React, {FC, memo, useState} from 'react';
import cn from 'classnames';

import {SizeType, AvatarStateType} from 'ui-kit/types';
import {ReactComponent as AstronautIcon} from 'ui-kit/icons/professions-man-astronaut.svg';

import * as styled from './Avatar.styled';

interface AvatarProps {
  avatarSrc?: string;
  size: SizeType;
  state?: AvatarStateType;
  onClick?: () => void;
  showBorder?: boolean;
  showHover?: boolean;
}

const Avatar: FC<AvatarProps> = ({
  avatarSrc,
  size,
  state = 'none',
  onClick,
  showBorder = false,
  showHover = false
}) => {
  const [error, setError] = useState(false);

  return (
    <styled.Container
      className={cn(size, showBorder && 'showBorder', showHover && 'showHover')}
      onClick={onClick}
    >
      {avatarSrc && !error ? (
        <styled.ImageWrapper>
          <styled.Image src={avatarSrc} alt={avatarSrc} onError={() => setError(true)} />
        </styled.ImageWrapper>
      ) : (
        <AstronautIcon className="avatar" data-testid="Avatar-placeholder-test" />
      )}
      {state !== 'none' && (
        <styled.IndicatorWrapper className={size}>
          <styled.Indicator className={`${state} ${size}`} />
        </styled.IndicatorWrapper>
      )}
    </styled.Container>
  );
};

export default memo(Avatar);
