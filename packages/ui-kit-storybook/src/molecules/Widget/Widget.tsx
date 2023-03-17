import {FC, PropsWithChildren, memo, ReactNode} from 'react';
import cn from 'classnames';

import {IconButton} from '../../atoms';

import * as styled from './Widget.styled';

export interface WidgetPropsInterface extends PropsWithChildren {
  variant: 'primary' | 'secondary';
  hexagon: ReactNode;
  title: string;
  label?: string;
  onClose?: () => void;
}

const Widget: FC<WidgetPropsInterface> = ({variant, hexagon, title, label, children, onClose}) => {
  return (
    <styled.Container data-testid="Widget-test" className={cn(variant)}>
      <styled.Header className={cn(variant)}>
        <styled.Hexagon>{hexagon}</styled.Hexagon>
        <styled.TitleContainer>
          <styled.Title>{title}</styled.Title>
          <styled.Label>{label}</styled.Label>
        </styled.TitleContainer>
        <styled.Actions className={cn(variant)}>
          <IconButton name="close_large" size="s" onClick={onClose} />
        </styled.Actions>
      </styled.Header>

      <styled.Content>{children}</styled.Content>
    </styled.Container>
  );
};

export default memo(Widget);
