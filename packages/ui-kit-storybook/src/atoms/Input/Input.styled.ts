import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  --width-default: 320px;

  --height: initial;
  --height-normal: 40px;
  --height-small: 30px;

  position: relative;
  width: var(--width-default);

  input {
    padding: 0 20px;
    width: 100%;
    height: var(--height);
    background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
    border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
    color: ${(props) => props.theme.text};
    border-radius: 4px;
    letter-spacing: 0.5px;
    transition: background var(--tr-150-ei), color var(--tr-150-ei);

    &::placeholder {
      color: ${(props) => props.theme.text && rgba(props.theme.text, 0.8)};
    }

    /* STATES */

    &:hover {
      background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
      color: ${(props) => props.theme.accentText};
    }

    &:focus {
      background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
    }

    &.danger {
      background: ${(props) => props.theme.danger && rgba(props.theme.danger, 0.4)};
    }

    &.search {
      padding: 0 40px 0 20px;
    }

    &:disabled {
      background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};
      color: ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};

      &:hover {
        cursor: not-allowed;
      }
    }

    /* SIZES */

    &.normal {
      --height: var(--height-normal);
    }

    &.small {
      --height: var(--height-small);
    }
  }

  &.wide {
    width: 100%;
  }
`;

export const IconSearch = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  right: 10px;
  bottom: 0;
  top: 0;
`;
