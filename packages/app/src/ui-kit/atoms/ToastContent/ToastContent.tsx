import {FC, memo} from 'react';
import cn from 'classnames';
import {Hexagon, IconNameType, ButtonEllipse, IconButton} from '@momentum-xyz/ui-kit';

import {ToastButtonInfoInterface} from 'ui-kit/interfaces';

import * as styled from './ToastContent.styled';

interface PropsInterface {
  icon?: IconNameType;
  text?: string | null;
  isDanger?: boolean;
  hideCloseButton?: boolean;
  approveInfo?: ToastButtonInfoInterface;
  declineInfo?: ToastButtonInfoInterface;
  onClose?: () => void;
}

const ToastContent: FC<PropsInterface> = ({
  icon,
  text,
  isDanger,
  hideCloseButton,
  approveInfo,
  declineInfo,
  onClose
}) => {
  return (
    <styled.ToastContainer data-testid="ToastContent-test" className={cn(isDanger && 'danger')}>
      {icon && (
        <Hexagon iconName={icon} type="fourth" noHover color={isDanger ? 'danger' : 'normal'} />
      )}

      <styled.Content>
        <styled.Message>{text}</styled.Message>
        <styled.Buttons>
          {approveInfo && (
            <ButtonEllipse
              variant="secondary"
              label={approveInfo.title}
              icon={approveInfo.icon || 'check_large'}
              onClick={approveInfo.onClick}
            />
          )}
          {declineInfo && (
            <ButtonEllipse
              variant="secondary"
              label={declineInfo.title}
              icon={declineInfo.icon || 'close_large'}
              onClick={declineInfo.onClick}
            />
          )}
        </styled.Buttons>
      </styled.Content>

      {!hideCloseButton && (
        <styled.CloseButton>
          <IconButton name="close_large" onClick={onClose} />
        </styled.CloseButton>
      )}
    </styled.ToastContainer>
  );
};

export default memo(ToastContent);
