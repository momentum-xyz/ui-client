import React, {FC, memo, useState} from 'react';
import cn from 'classnames';

import {SizeType} from 'ui-kit/types';
import {ReactComponent as AstronautIcon} from 'ui-kit/icons/professions-man-astronaut.svg';
import {UserStatusEnum} from 'core/enums';

import * as styled from './Avatar.styled';

interface AvatarProps {
  avatarSrc?: string;
  size: SizeType;
  status?: UserStatusEnum;
  onClick?: () => void;
  showBorder?: boolean;
  showHover?: boolean;
  className?: string;
}

const Avatar: FC<AvatarProps> = ({
  avatarSrc,
  size,
  className,
  status = 'none',
  onClick,
  showBorder = false,
  showHover = false
}) => {
  const [error, setError] = useState(false);

  return (
    <styled.Container
      className={cn(size, showBorder && 'showBorder', showHover && 'showHover', className)}
      onClick={onClick}
    >
      {avatarSrc && !error ? (
        <styled.ImageWrapper>
          <styled.Image src={avatarSrc} alt={avatarSrc} onError={() => setError(true)} />
        </styled.ImageWrapper>
      ) : (
        <AstronautIcon className="avatar" data-testid="Avatar-placeholder-test" />
      )}
      <styled.IndicatorWrapper className={size}>
        <styled.Indicator className={`${status} ${size}`} />
      </styled.IndicatorWrapper>
    </styled.Container>
  );
};

export default memo(Avatar);
