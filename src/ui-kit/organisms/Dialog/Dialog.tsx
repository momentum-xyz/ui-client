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
  ComponentSizeInterface
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
  controlUnityKeyboardControll?: boolean;
  headerActions?: React.ReactNode;
  hasBorder?: boolean;
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
  closeOnBackgroundClick = true,
  showCloseButton = false,
  withOpacity = false,
  headerStyle = 'divider-uppercase',
  hasBorder = false,
  onClose,
  icon,
  iconSize,
  isBodyExtendingToEdges,
  showBackground = true,
  controlUnityKeyboardControll = false,
  layoutSize,
  headerActions
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
    if (controlUnityKeyboardControll) {
      unityStore.changeKeyboardControl(false);
    }

    return () => {
      unityStore.changeKeyboardControl(true);
    };
  }, []);

  return (
    <Portal>
      <styled.Modal
        theme={theme}
        className={cn(position, {opacity: withOpacity, showBackground: showBackground})}
      >
        <styled.Container ref={ref} className={position} offset={offset}>
          <PanelLayout
            title={title}
            subtitle={subtitle}
            headerStyle={headerStyle}
            headerIconName={icon}
            onClose={showCloseButton ? onClose : undefined}
            iconSize={iconSize}
            isBodyExtendingToEdges={isBodyExtendingToEdges}
            componentSize={layoutSize}
            headerActions={headerActions}
            hasBorder={hasBorder}
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
