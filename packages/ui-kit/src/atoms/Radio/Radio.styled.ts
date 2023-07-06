import styled from 'styled-components';
import {rgba} from 'polished';

import checked from '../../assets/icons/ellipse.svg';

export const RadioList = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: flex-start;

  &.horizontal {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
`;

export const Form = styled.div`
  --size: 18px;
  --ellipse-size: 8px;
  --mark-size: 12px;
  --radius: 50%;
  --offset: 8px;

  &:last-child {
    margin: 0;
  }

  input[type='radio'] {
    display: none;
  }

  label {
    display: flex;
    cursor: pointer;
    position: relative;
    line-height: var(--size);
    color: ${(props) => props.theme.text};
    gap: var(--offset);
    user-select: none;
  }

  .mark {
    width: var(--size);
    height: var(--size);
    border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.8)};
    background-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
    border-radius: var(--radius);
    transition: background-color var(--tr-100-ei);
  }

  /* CHECKED */

  input[type='radio']:checked + label:before {
    position: absolute;
    display: block;
    width: var(--ellipse-size);
    height: var(--ellipse-size);
    content: '';
    border-radius: var(--radius);
    border: 1px solid transparent;
    background-color: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.8)};
    mask: url(${checked}) no-repeat center;
    mask-size: var(--mark-size);
    left: 5px;
    top: 5px;
  }

  input[type='radio']:checked + label .mark {
    background-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
  }

  /* HOVER */

  label:hover .mark {
    background-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
  }

  /* DISABLED */

  input[type='radio']:disabled + label {
    color: ${(props) => props.theme.text && rgba(props.theme.text, 0.4)};
    cursor: not-allowed;
  }

  input[type='radio']:disabled + label .mark {
    background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};
  }
`;
