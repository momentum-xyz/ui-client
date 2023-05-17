import {FC, PropsWithChildren, useRef} from 'react';
import cn from 'classnames';

import {ButtonEllipse, IconSvg, Portal} from '../../atoms';
import {IconNameType} from '../../types';
import {useClickOutside} from '../../hooks';

import * as styled from './Dialog.styled';

export interface ButtonInfoInterface {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: IconNameType;
}

export interface DialogPropsInterface {
  title: string;
  icon?: IconNameType;
  approveInfo?: ButtonInfoInterface;
  declineInfo?: ButtonInfoInterface;
  showBackground?: boolean;
  closeOnBackgroundClick?: boolean;
  onClose?: () => void;
}

const Dialog: FC<PropsWithChildren<DialogPropsInterface>> = ({
  title,
  approveInfo,
  declineInfo,
  icon,
  closeOnBackgroundClick,
  showBackground = true,
  children,
  onClose
}) => {
  const ref = useRef(null);

  useClickOutside(ref, () => {
    if (closeOnBackgroundClick) {
      onClose?.();
    }
  });

  return (
    <Portal>
      <styled.Modal data-testid="Dialog-test" className={cn(showBackground && 'showBackground')}>
        <styled.Container ref={ref}>
          <styled.Header>
            <styled.Title>
              {icon && <IconSvg size="m" name={icon} />}
              <div>{title}</div>
            </styled.Title>
            {onClose && <IconSvg size="m" name="close_large" onClick={onClose} />}
          </styled.Header>

          <styled.Content>{children}</styled.Content>

          <styled.Buttons>
            {approveInfo && (
              <ButtonEllipse
                label={approveInfo.title}
                variant="primary"
                icon={approveInfo.icon}
                onClick={approveInfo.onClick}
                disabled={approveInfo.disabled}
              />
            )}

            {declineInfo && (
              <ButtonEllipse
                label={declineInfo.title}
                variant="secondary"
                icon={declineInfo.icon}
                onClick={declineInfo.onClick}
                disabled={declineInfo.disabled}
              />
            )}
          </styled.Buttons>
        </styled.Container>
      </styled.Modal>
    </Portal>
  );
};

export default Dialog;
