import styled from 'styled-components';
import {rgba} from 'polished';

import checked from '../../assets/icons/checked.svg';

export const Label = styled.label`
  --size: 18px;
  --mark-size: 12px;
  --radius: 4px;
  --offset: 8px;

  position: relative;
  display: flex;
  color: ${(props) => props.theme.text};
  line-height: var(--size);
  align-items: flex-start;
  cursor: pointer;

  .label {
    padding: 0 var(--offset);
    line-height: 22px;
    letter-spacing: 0.28px;
  }

  .inputView {
    position: relative;
    width: var(--size);
    height: var(--size);
    border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.8)};
    background-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
    border-radius: var(--radius);
    flex-shrink: 0;
    opacity: 1;

    &::before {
      position: absolute;
      display: block;
      content: '';
      width: calc(var(--size) - 2px);
      height: calc(var(--size) - 2px);
      border-radius: var(--radius);
      border: 1px solid transparent;
      background-color: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.8)};
      mask: url(${checked}) no-repeat center;
      mask-size: var(--mark-size);
      opacity: 0;
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

  .input:hover + .inputView {
    background-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
    transition: background-color var(--tr-100-ei);
  }

  .input:checked + .inputView {
    background-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
    border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.8)};

    &::before {
      opacity: 1;
    }
  }

  /* DISABLED */

  .input:disabled + .inputView {
    background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};
  }

  .input:disabled:hover + .inputView {
    cursor: not-allowed;
  }

  .input:disabled + .inputView + span {
    color: ${(props) => props.theme.text && rgba(props.theme.text, 0.4)};

    &:hover {
      cursor: not-allowed;
    }
  }

  /* FOCUS */

  .input:focus + .inputView {
    outline: none;
  }
`;
