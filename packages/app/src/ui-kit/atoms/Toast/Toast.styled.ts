import styled from 'styled-components';
import {ToastContainer} from 'react-toastify';
import {rgba} from 'polished';

export const ToastContainerStyled = styled(ToastContainer)`
  &.Toastify__toast-container {
    margin: 0 0 50px 0;
    padding: 0;
    width: 400px;
  }

  .Toastify__toast {
    border-radius: 4px;
  }

  .Toastify__toast-body {
    padding: 0;
  }

  .Toastify__toast-icon {
    display: none;
  }

  .Toastify__toast--default {
    padding: 0;
    .Toastify__close-button {
      display: none;
    }
  }

  .Toastify__progress-bar {
    background: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 1)} !important;
    height: 3px;
  }

  .Toastify__toast--info {
    background: #0517451a;
    padding: 0;
    border: none;

    .Toastify__progress-bar {
      background: ${(props) => props.theme.accentText} !important;
    }
    .Toastify__close-button {
      display: none;
    }
  }

  .Toastify__toast--error {
    background: #0517451a;
    padding: 0;
    border: none;
    .Toastify__progress-bar {
      background: ${(props) => props.theme.danger} !important;
    }
    .Toastify__close-button {
      display: none;
    }
  }

  .Toastify__toast--success {
    padding: 15px 20px;
    background: ${(props) =>
      props.theme.accentText && rgba(props.theme.accentText, 0.7)} !important;
    border: 1px solid;
    border-color: ${(props) => props.theme.accentText} !important;
  }

  .Toastify__toast--warning {
    padding: 15px 20px;
    background: ${(props) => props.theme.danger && rgba(props.theme.danger, 0.7)} !important;
    border: 1px solid;
    border-color: ${(props) => props.theme.danger} !important;

    .Toastify__progress-bar {
      background: ${(props) => props.theme.danger} !important;
    }
  }
`;
