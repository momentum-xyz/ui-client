import styled from 'styled-components';
import {rgba} from 'polished';

import checked from '../../assets/icons/checked.svg';

export const Label = styled.label`
  --checkbox-size: 18px;
  --checkbox-checked-size: 18px;
  --checkbox-bg: var(--white);
  --box-size: 13px;
  --margin-right: 7px;

  position: relative;
  display: flex;
  align-items: center;
  color: var(--white);
  cursor: pointer;
  line-height: var(--checkbox-size);

  > * + * {
    margin-right: var(--margin-right);
  }

  .inputView {
    position: relative;
    width: var(--checkbox-size);
    height: var(--checkbox-size);
    flex-shrink: 0;
    border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.8)};
    background-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
    border-radius: 4px;
    opacity: 1;

    &::before {
      position: absolute;
      display: block;
      background: url('${checked}') no-repeat center center;
      background-size: 12px;
      content: '';
      opacity: 0;
      width: var(--checkbox-checked-size);
      height: var(--checkbox-checked-size);
      transform: translateZ(0) scale(0.5);
    }
  }

  .disabled {
    color: red;
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

  .input:checked + .inputView {
    border: none;
    background-color: transparent;

    &::before {
      border-radius: 4px;
      border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.8)};
      background-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
      opacity: 1;
      transform: scale(1);
    }
  }

  /* DISABLED */

  .input:disabled + .inputView {
    opacity: 0.5;
  }

  .input:checked:disabled + .inputView {
    &::before {
      background-image: url('${checked}');
      opacity: 1;
      transform: scale(1);
    }
  }

  .input:checked:disabled + .inputView + span {
    color: var(--grey);
  }

  .input:focus + .inputView {
    outline: none;
  }
`;
