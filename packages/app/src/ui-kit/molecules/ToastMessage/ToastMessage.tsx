import React, {FC, memo} from 'react';
import {ToastOptions, ToastPosition} from 'react-toastify/dist/types';
import {PropsWithThemeInterface} from '@momentum-xyz/ui-kit';

import * as styled from './ToastMessage.styled';

interface PropsInterface extends PropsWithThemeInterface {
  position?: ToastPosition;
}

export const TOAST_BASE_OPTIONS: ToastOptions = {
  closeOnClick: true
};

export const TOAST_COMMON_OPTIONS: ToastOptions = {
  autoClose: 3000,
  closeOnClick: true
};

export const TOAST_GROUND_OPTIONS: ToastOptions = {
  autoClose: 5000,
  closeOnClick: true
};

export const TOAST_NOT_AUTO_CLOSE_OPTIONS: ToastOptions = {
  closeOnClick: true,
  autoClose: false,
  draggable: false
};

const ToastMessage: FC<PropsInterface> = (props) => {
  const {position} = props;

  return <styled.ToastContainerStyled position={position} data-testid="ToastMessage-test" />;
};

export default memo(ToastMessage);
