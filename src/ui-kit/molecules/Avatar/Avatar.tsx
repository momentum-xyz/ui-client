import React, {FC, memo, useState} from 'react';
import cn from 'classnames';

import {SizeType} from 'ui-kit/types';
import {UserStatusEnum} from 'ui-kit/enums';
import {PropsWithThemeInterface} from 'ui-kit/interfaces';

import * as styled from './Avatar.styled';

interface PropsInterface extends PropsWithThemeInterface {
  avatarSrc?: string;
  size: SizeType;
  status?: UserStatusEnum;
  onClick?: () => void;
  showBorder?: boolean;
  showHover?: boolean;
  className?: string;
}

const Avatar: FC<PropsInterface> = ({
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
      data-testid="Avatar-test"
      className={cn(size, showBorder && 'showBorder', showHover && 'showHover', className)}
      onClick={onClick}
    >
      {avatarSrc && !error ? (
        <styled.ImageWrapper>
          <styled.Image src={avatarSrc} alt={avatarSrc} onError={() => setError(true)} />
        </styled.ImageWrapper>
      ) : (
        <styled.AvatarPlaceholder data-testid="Avatar-placeholder-test" />
      )}
      <styled.IndicatorWrapper className={size}>
        <styled.Indicator className={`${status} ${size}`} />
      </styled.IndicatorWrapper>
    </styled.Container>
  );
};

export default memo(Avatar);
