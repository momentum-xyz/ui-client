import {FC, memo} from 'react';
import {Hexagon, IconNameType, ButtonEllipse, IconButton} from '@momentum-xyz/ui-kit-storybook';

import {ToastButtonInfoInterface} from 'ui-kit/interfaces';

import * as styled from './ToastContent.styled';

interface PropsInterface {
  title?: string | null;
  icon?: IconNameType;
  text?: string | null;
  isDanger?: boolean;
  showCloseButton?: boolean;
  approveInfo?: ToastButtonInfoInterface;
  declineInfo?: ToastButtonInfoInterface;
  onClose?: () => void;
}

const ToastContent: FC<PropsInterface> = ({
  icon,
  text,
  isDanger,
  showCloseButton,
  approveInfo,
  declineInfo,
  onClose
}) => {
  return (
    <styled.ToastContainer data-testid="ToastContent-test">
      {icon && <Hexagon iconName={icon} type="fourth" />}
      <styled.Content>
        <styled.Message>{text}</styled.Message>
        <styled.Buttons>
          {approveInfo && (
            <ButtonEllipse
              label={approveInfo.title}
              icon={approveInfo.icon || 'check_large'}
              onClick={approveInfo.onClick}
            />
          )}
          {declineInfo && (
            <ButtonEllipse
              label={declineInfo.title}
              icon={declineInfo.icon || 'close_large'}
              onClick={declineInfo.onClick}
            />
          )}
        </styled.Buttons>
      </styled.Content>
      {showCloseButton && (
        <styled.CloseButton>
          <IconButton name="close_large" onClick={onClose} />
        </styled.CloseButton>
      )}
    </styled.ToastContainer>
  );
};

export default memo(ToastContent);
