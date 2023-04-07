import {FC, PropsWithChildren} from 'react';
import cn from 'classnames';

import {IconNameType} from '../../types';
import {Hexagon, IconButton} from '../../atoms';

import * as styled from './Panel.styled';

export interface PanelPropsInterface extends PropsWithChildren {
  variant: 'primary' | 'secondary';
  title: string;
  label?: string;
  image?: string | null;
  icon?: IconNameType;
  closeIcon?: IconNameType;
  onClose?: () => void;
}

const Panel: FC<PanelPropsInterface> = ({
  variant,
  title,
  label,
  image,
  icon,
  closeIcon = 'close_large',
  children,
  onClose
}) => {
  return (
    <styled.Container data-testid="Widget-test" className={cn(variant)}>
      <styled.Header className={cn(variant)}>
        <styled.Hexagon>
          {variant === 'primary' && (
            <Hexagon type="secondary-borderless" iconName={icon} imageSrc={image} />
          )}
          {variant === 'secondary' && (
            <Hexagon type="fourth-borderless" iconName={icon} imageSrc={image} />
          )}
        </styled.Hexagon>
        <styled.TitleContainer>
          <styled.Title>{title}</styled.Title>
          <styled.Label>{label}</styled.Label>
        </styled.TitleContainer>
        <styled.Actions className={cn(variant)}>
          <IconButton name={closeIcon} size="s" onClick={onClose} />
        </styled.Actions>
      </styled.Header>

      <styled.Content>{children}</styled.Content>
    </styled.Container>
  );
};

export default Panel;
