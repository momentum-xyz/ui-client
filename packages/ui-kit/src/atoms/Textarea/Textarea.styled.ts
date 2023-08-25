import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  --padding: initial;
  --padding-normal: 8px 20px;

  textarea {
    padding: var(--padding);
    width: 100%;
    background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
    border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
    color: ${(props) => props.theme.text};
    border-radius: 4px;
    font-size: var(--font-size-m);
    line-height: 22px;
    letter-spacing: 0.02em;
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

    &.disableResize {
      resize: none;
    }

    &:disabled {
      border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.4)};
      background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};
      color: ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};

      &:hover {
        cursor: not-allowed;
      }
    }

    /* SIZES */

    &.normal {
      --padding: var(--padding-normal);
    }
  }
`;
