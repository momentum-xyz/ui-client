import styled from 'styled-components';
import {ToastContainer} from 'react-toastify';
import {rgba} from 'polished';

export const Div = styled.div``;

export const ToastContainerStyled = styled(ToastContainer)`
  &&&.Toastify__toast-container {
    text-align: center;
    margin: 40px 0px;
    padding: 0px;
    width: 490px;
    color: ${(props) => props.theme.text} !important;
  }
  .Toastify__toast {
    border-radius: 10px !important;
    min-height: 64px;
  }
  .Toastify__toast-body {
    font-size: var(--font-size-s);
    padding: 0;
  }

  .Toastify__close-button {
    margin: auto;
    color: ${(props) => props.theme.text} !important;
  }

  .Toastify__close-button > svg {
    height: 16px;
    width: 16px;
  }

  .Toastify__toast--default {
    padding: 0;
    .Toastify__close-button {
      display: none;
    }
  }

  .Toastify__progress-bar {
    background: ${(props) => props.theme.accent && rgba(props.theme.accent, 1)} !important;
    height: 3px;
  }

  .Toastify__toast--info {
    background: #0517451a;
    padding: 0;
    border: none;
    .Toastify__progress-bar {
      background: ${(props) => props.theme.accent} !important;
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
      background: ${(props) => props.theme.accentDanger} !important;
    }
    .Toastify__close-button {
      display: none;
    }
  }
  .Toastify__toast--success {
    padding: 15px 20px;
    background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.7)} !important;
    border: 1px solid;
    border-color: ${(props) => props.theme.accent} !important;
  }

  .Toastify__toast--warning {
    padding: 15px 20px;
    background: ${(props) =>
      props.theme.accentDanger && rgba(props.theme.accentDanger, 0.7)} !important;
    border: 1px solid;
    border-color: ${(props) => props.theme.accentDanger} !important;

    .Toastify__progress-bar {
      background: ${(props) => props.theme.accentDanger} !important;
    }
  }
`;
