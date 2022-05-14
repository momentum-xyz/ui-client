import styled from 'styled-components';
import {rgba} from 'polished';

// FIXME: using css-constants in the rgba
const DANGER_COLOR = '#ffae63';

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid;
  transition: border var(--tr-150-ei), color var(--tr-150-ei), background var(--tr-150-ei);
  /* VARIANTS */

  &.primary {
    color: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.9)};
    border-color: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.9)};
    border-radius: 5px;

    &:hover,
    &:active {
      color: ${(props) => props.theme.accent};
      border-color: ${(props) => props.theme.accent};
      background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.2)};
    }

    &:disabled {
      color: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.1)};
      border-color: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.1)};
      background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.1)};

      &:hover {
        cursor: not-allowed;
      }
    }
  }

  &.secondary {
    color: ${(props) => props.theme.text};
    background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.1)};
    border-color: transparent;
    border-radius: 11px;

    &:hover,
    &:active {
      color: ${(props) => props.theme.text};
      background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.2)};
      border-color: transparent;
    }

    &:disabled {
      color: ${(props) => props.theme.text};
      background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.05)};
      border-color: transparent;

      &:hover {
        cursor: not-allowed;
      }
    }
  }

  &.danger {
    color: ${rgba(DANGER_COLOR, 0.9)};
    border-color: ${rgba(DANGER_COLOR, 0.9)};
    border-radius: 5px;

    &:hover,
    &:active {
      color: var(--danger);
      border-color: var(--danger);
      background: ${rgba(DANGER_COLOR, 0.2)};
    }

    &:disabled {
      color: ${rgba(DANGER_COLOR, 0.1)};
      border-color: ${rgba(DANGER_COLOR, 0.1)};
      background: ${rgba(DANGER_COLOR, 0.1)};

      &:hover {
        cursor: not-allowed;
      }
    }
  }

  &.inverted {
    color: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.9)};
    background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.9)};
    border: 1px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 0.9)};
    border-radius: 5px;

    .IconSvg-custom {
      color: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.9)};
    }

    &:hover,
    &:active {
      color: ${(props) => props.theme.accent};
      border-color: ${(props) => props.theme.accent};
      background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.2)};

      .IconSvg-custom {
        color: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.9)};
      }
    }

    &:disabled {
      color: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.1)};
      border-color: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.1)};
      background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.1)};

      &:hover {
        cursor: not-allowed;
      }
    }
  }

  /* SIZES */

  &.normal {
    height: 30px;
    gap: 10px;
    padding: 0 22px;
    text-transform: uppercase;
    font-size: var(--font-size-xs);
    font-weight: 500;
  }

  &.small {
    font-size: var(--font-size-xxs);
    width: 100%;
    padding: 5px;
    text-transform: uppercase;
  }

  &.medium {
    height: 28px;
    gap: 5px;
    padding: 0 9px;
    text-transform: uppercase;
    font-size: var(--font-size-xs);
    font-weight: 500;
  }

  &.wide {
    width: 100%;
  }

  &.noWhitespaceWrap {
    white-space: nowrap;
  }
`;
