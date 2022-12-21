import React, {FC, HTMLProps, useRef} from 'react';
import cn from 'classnames';

import {useClickOutside} from '../../hooks';
import {
  ButtonInfoInterface,
  OffsetInterface,
  ComponentSizeInterface,
  PropsWithThemeInterface
} from '../../interfaces';
import {Button, Portal} from '../../atoms';
import {PanelLayout} from '../../organisms';
import {
  HeaderStyleType,
  PlacementType,
  SizeType,
  HeaderType,
  HeaderItemType,
  IconNameType
} from '../../types';

import * as styled from './Dialog.styled';

export interface DialogPropsInterface extends PropsWithThemeInterface, HTMLProps<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  position?: PlacementType;
  offset?: OffsetInterface;
  approveInfo?: ButtonInfoInterface;
  declineInfo?: ButtonInfoInterface;
  onClose?: (event?: Event) => void;
  closeOnBackgroundClick?: boolean;
  showCloseButton?: boolean;
  withOpacity?: boolean;
  headerStyle?: HeaderStyleType;
  icon?: IconNameType;
  iconSize?: SizeType;
  isBodyExtendingToEdges?: boolean;
  showBackground?: boolean;
  layoutSize?: ComponentSizeInterface;
  headerActions?: React.ReactNode;
  hasBorder?: boolean;
  hasBottomPadding?: boolean;
  shortTopPadding?: boolean;
  headerItem?: HeaderItemType;
  titleWidth?: string;
  headerType?: HeaderType;
  showOverflow?: boolean;
  isTruncateHeader?: boolean;
  isMinimap?: boolean;
  tabs?: React.ReactElement;
}

const Dialog: FC<DialogPropsInterface> = ({
  title,
  subtitle,
  position = 'center',
  offset = {top: 0, right: 0, bottom: 0, left: 0},
  approveInfo,
  declineInfo,
  children,
  theme,
  headerItem,
  titleWidth,
  closeOnBackgroundClick = true,
  showCloseButton = false,
  withOpacity = false,
  headerStyle = 'divider-uppercase',
  hasBorder = false,
  shortTopPadding = false,
  hasBottomPadding = true,
  onClose,
  headerType,
  icon,
  iconSize,
  isBodyExtendingToEdges,
  showBackground = true,
  layoutSize,
  headerActions,
  showOverflow,
  isTruncateHeader = false,
  isMinimap,
  tabs
}) => {
  const ref = useRef(null);

  useClickOutside(ref, () => {
    if (closeOnBackgroundClick) {
      const event = new Event('backgroundClick');
      onClose?.(event);
    }
  });

  return (
    <Portal>
      <styled.Modal
        theme={theme}
        data-testid="Dialog-test"
        className={cn(
          position,
          {opacity: withOpacity, showBackground: showBackground},
          isMinimap && 'isMinimap'
        )}
      >
        <styled.Container
          ref={ref}
          className={cn(position, isMinimap && 'isMinimap')}
          offset={offset}
        >
          <PanelLayout
            title={title}
            subtitle={subtitle}
            headerStyle={headerStyle}
            headerItem={headerItem}
            titleWidth={titleWidth}
            headerIconName={icon}
            onClose={showCloseButton ? onClose : undefined}
            iconSize={iconSize}
            isBodyExtendingToEdges={isBodyExtendingToEdges}
            componentSize={layoutSize}
            headerActions={headerActions}
            hasBorder={hasBorder}
            hasBottomPadding={hasBottomPadding}
            shortTopPadding={shortTopPadding}
            headerType={headerType}
            showOverflow={showOverflow}
            isTruncateHeader={isTruncateHeader}
            isMinimap={isMinimap}
            tabs={tabs}
          >
            {children}
            <styled.Buttons>
              {declineInfo && (
                <styled.Button>
                  <Button
                    label={declineInfo.title}
                    theme={theme}
                    variant={declineInfo.variant || 'danger'}
                    icon={declineInfo.icon}
                    onClick={declineInfo.onClick}
                    disabled={declineInfo.disabled}
                  />
                </styled.Button>
              )}
              {approveInfo && (
                <styled.Button>
                  <Button
                    label={approveInfo.title}
                    theme={theme}
                    variant={approveInfo.variant || 'primary'}
                    icon={approveInfo.icon}
                    onClick={approveInfo.onClick}
                    disabled={approveInfo.disabled}
                  />
                </styled.Button>
              )}
            </styled.Buttons>
          </PanelLayout>
        </styled.Container>
      </styled.Modal>
    </Portal>
  );
};

export default Dialog;
