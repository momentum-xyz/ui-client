import {FC, PropsWithChildren, memo, ReactNode} from 'react';
import cn from 'classnames';

import {IconButton} from '../../atoms';

import * as styled from './Widget.styled';

export interface WidgetPropsInterface extends PropsWithChildren {
  variant: 'primary' | 'secondary';
  hexagon: ReactNode;
  title: string;
  label?: string;
  wide?: boolean;
  onClose?: () => void;
}

const Widget: FC<PropsWithChildren<WidgetPropsInterface>> = ({
  variant,
  hexagon,
  title,
  label,
  wide,
  children,
  onClose
}) => {
  return (
    <styled.Container data-testid="Widget-test" className={cn(variant, wide && 'wide')}>
      <styled.Header className={cn(variant)}>
        <styled.Hexagon className={cn(variant)}>{hexagon}</styled.Hexagon>
        <styled.TitleContainer>
          <styled.Title>{title}</styled.Title>
          <styled.Label>{label}</styled.Label>
        </styled.TitleContainer>
        <styled.Actions className={cn(variant)}>
          <IconButton name="close" size="s" onClick={onClose} />
        </styled.Actions>
      </styled.Header>

      <styled.Content>{children}</styled.Content>
    </styled.Container>
  );
};

export default memo(Widget);
