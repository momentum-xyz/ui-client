import styled from 'styled-components';
import {ToastContainer} from 'react-toastify';

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

  .Toastify__close-button {
    display: none;
  }

  .Toastify__progress-bar {
    height: 1px;
  }

  .Toastify__toast--default {
    padding: 0;
  }

  .Toastify__toast--info {
    padding: 0;
    border: none;
    background: none;

    .Toastify__progress-bar {
      background: ${(props) => props.theme.accentText} !important;
    }
  }

  .Toastify__toast--success {
    padding: 0;
    border: none;
    background: none;

    .Toastify__progress-bar {
      background: ${(props) => props.theme.success} !important;
    }
  }

  .Toastify__toast--error {
    padding: 0;
    border: none;
    background: none;

    .Toastify__progress-bar {
      background: ${(props) => props.theme.text} !important;
    }
  }

  .Toastify__toast--warning {
    padding: 0;
    border: none;
    background: none;

    .Toastify__progress-bar {
      background: ${(props) => props.theme.danger} !important;
    }
  }
`;
