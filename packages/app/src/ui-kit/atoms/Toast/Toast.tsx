import {FC, memo} from 'react';
import {toast} from 'react-toastify';
import {ToastOptions} from 'react-toastify/dist/types';

import * as styled from './Toast.styled';

import 'react-toastify/dist/ReactToastify.css';

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

const Toast: FC = () => (
  <styled.ToastContainerStyled data-testid="Toast-test" position={toast.POSITION.BOTTOM_RIGHT} />
);

export default memo(Toast);
