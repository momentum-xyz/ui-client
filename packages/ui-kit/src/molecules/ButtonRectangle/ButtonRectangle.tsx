import {memo, forwardRef} from 'react';
import cn from 'classnames';

import {IconSvg} from '../../atoms';
import {IconNameType} from '../../types';

import * as styled from './ButtonRectangle.styled';

export interface ButtonRectanglePropsInterface {
  title: string;
  label: string;
  icon?: IconNameType;
  imageSrc?: string;
  size?: 'normal';
  variant?: 'primary';
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const ButtonRectangle = forwardRef<HTMLButtonElement, ButtonRectanglePropsInterface>(
  (
    {icon, imageSrc, title, label, variant = 'primary', size = 'normal', disabled, active, onClick},
    ref
  ) => {
    return (
      <styled.Button
        data-testid="ButtonRectangle-test"
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={cn(variant, size, active && 'active')}
      >
        <styled.Inner>
          <styled.ImageOrIcon>
            {icon && (
              <styled.Icon className="icon">
                <IconSvg name={icon} size="m" />
              </styled.Icon>
            )}
            {imageSrc && <styled.Image src={imageSrc} />}
          </styled.ImageOrIcon>
          <styled.TitleContainer>
            <styled.Title>{title}</styled.Title>
            <styled.Label>{label}</styled.Label>
          </styled.TitleContainer>
        </styled.Inner>
      </styled.Button>
    );
  }
);

export default memo(ButtonRectangle);
