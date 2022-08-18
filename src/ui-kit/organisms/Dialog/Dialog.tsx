import React, {FC, HTMLProps, useRef, useEffect} from 'react';
import cn from 'classnames';

import {ButtonInfoInterface, OffsetInterface, PropsWithThemeInterface} from 'ui-kit/interfaces';
import {
  PanelLayout,
  Button,
  Portal,
  HeaderStyleType,
  PlacementType,
  SizeType,
  ComponentSizeInterface,
  HeaderType,
  HeaderItem
} from 'ui-kit';
import {useClickOutside} from 'ui-kit/hooks';
import {useStore} from 'shared/hooks';

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
  icon?: IconName;
  iconSize?: SizeType;
  isBodyExtendingToEdges?: boolean;
  showBackground?: boolean;
  layoutSize?: ComponentSizeInterface;
  controlUnityKeyboardControl?: boolean;
  headerActions?: React.ReactNode;
  hasBorder?: boolean;
  headerItem?: HeaderItem;
  titleWidth?: string;
  headerType?: HeaderType;
  showOverflow?: boolean;
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
  onClose,
  headerType,
  icon,
  iconSize,
  isBodyExtendingToEdges,
  showBackground = true,
  controlUnityKeyboardControl = false,
  layoutSize,
  headerActions,
  showOverflow
}) => {
  const ref = useRef(null);
  const {unityStore} = useStore().mainStore;

  useClickOutside(ref, () => {
    if (closeOnBackgroundClick) {
      const event = new Event('backgroundClick');
      onClose?.(event);
    }
  });

  useEffect(() => {
    if (controlUnityKeyboardControl) {
      unityStore.changeKeyboardControl(false);
    }

    return () => {
      unityStore.changeKeyboardControl(controlUnityKeyboardControl);
    };
  }, []);

  return (
    <Portal>
      <styled.Modal
        theme={theme}
        data-testid="Dialog-test"
        className={cn(position, {opacity: withOpacity, showBackground: showBackground})}
      >
        <styled.Container ref={ref} className={position} offset={offset}>
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
            headerType={headerType}
            showOverflow={showOverflow}
          >
            {children}
            <styled.Buttons>
              {declineInfo && (
                <styled.Button>
                  <Button
                    label={declineInfo.title}
                    theme={theme}
                    variant="danger"
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
                    variant="primary"
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
