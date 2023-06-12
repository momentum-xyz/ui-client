import {FC, PropsWithChildren, ReactNode, useLayoutEffect, useRef, useState} from 'react';
import cn from 'classnames';

import {IconNameType} from '../../types';
import {Hexagon, IconButton} from '../../atoms';

import * as styled from './Panel.styled';
import '../../styles-global.styled';

export interface PanelPropsInterface extends PropsWithChildren {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'normal' | 'large' | 'wide';
  title: string;
  label?: string;
  image?: string | null;
  isFullHeight?: boolean;
  icon?: IconNameType;
  closeIcon?: IconNameType;
  isCloseDisabled?: boolean;
  topComponent?: ReactNode;
  bottomComponent?: ReactNode;
  onClose?: () => void;
}

const Panel: FC<PanelPropsInterface> = ({
  variant = 'primary',
  size = 'normal',
  title,
  label,
  image,
  icon,
  isFullHeight,
  closeIcon = 'close_large',
  isCloseDisabled = false,
  topComponent,
  bottomComponent,
  children,
  onClose
}) => {
  const [topComponentHeight, setTopComponentHeight] = useState(0);
  const [bottomComponentHeight, setBottomComponentHeight] = useState(0);

  const topComponentRef = useRef<HTMLDivElement>(null);
  const bottomComponentRef = useRef<HTMLDivElement>(null);

  // It must be called on each render. Don't add deps.
  useLayoutEffect(() => {
    setTopComponentHeight(topComponentRef.current?.clientHeight || 0);
    setBottomComponentHeight(bottomComponentRef.current?.clientHeight || 0);
  });

  return (
    <styled.Container data-testid="Widget-test" className={cn(variant, `size-${size}`)}>
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
          <IconButton name={closeIcon} size="s" onClick={onClose} isDisabled={isCloseDisabled} />
        </styled.Actions>
      </styled.Header>

      {topComponent && (
        <styled.TopComponent ref={topComponentRef}>{topComponent}</styled.TopComponent>
      )}

      <styled.ScrollableContainer
        offset={topComponentHeight + bottomComponentHeight}
        className={cn(isFullHeight && 'fullHeight')}
      >
        {children}
      </styled.ScrollableContainer>

      {bottomComponent && (
        <styled.BottomComponent ref={bottomComponentRef}>{bottomComponent}</styled.BottomComponent>
      )}
    </styled.Container>
  );
};

export default Panel;
