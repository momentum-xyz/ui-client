import styled from 'styled-components';
import {rgba} from 'polished';

import checked from '../../assets/icons/ellipse.svg';

export const Label = styled.label`
  --width: 30px;
  --height: 16px;
  --mark-size: 10px;
  --radius: 12px;

  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;

  .wrapper {
    width: var(--width);
    height: var(--height);
    border-radius: var(--radius);
    border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.8)};
  }

  .inner {
    padding: 2px;
    width: calc(var(--width) - 2px);
    height: calc(var(--height) - 2px);
    border-radius: var(--radius);
    background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};

    &.checked {
      background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};

      &:hover {
        background: ${(props) => props.theme.accentBg};
      }
    }

    &.disabled {
      background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};

      &:hover {
        background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};
      }
    }
  }

  .inputView {
    position: relative;
    width: calc(var(--width) - 6px);
    height: calc(var(--height) - 6px);
    background-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
    border-radius: var(--radius);
    opacity: 1;

    &::before {
      position: absolute;
      display: block;
      content: '';
      width: var(--mark-size);
      height: var(--mark-size);
      border: 1px solid transparent;
      background-color: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.8)};
      mask: url(${checked}) no-repeat center;
      mask-size: var(--mark-size);
      transition: left var(--tr-100-ei);
      left: 0;
    }
  }

  /* CHECKED */

  .input {
    position: absolute;
    overflow: hidden;
    width: 1px;
    height: 1px;
    background: transparent;
    opacity: 0;
  }

  .input:hover + .wrapper .inputView {
    background-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
    transition: background-color var(--tr-100-ei);
  }

  .input:checked + .wrapper .inputView {
    background-color: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.4)};

    &::before {
      left: calc(100% - var(--mark-size));
    }
  }

  .input:checked:hover + .wrapper .inputView {
    background-color: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
  }

  /* DISABLED */

  .input:disabled + .wrapper .inputView {
    background: transparent;
    cursor: not-allowed;

    &::before {
      opacity: 0;
    }
  }

  .input:checked:disabled + .wrapper .inputView {
    background: transparent;

    &::before {
      opacity: 1;
    }
  }

  /* FOCUS */

  .input:focus + .wrapper .inputView {
    outline: none;
  }
`;
