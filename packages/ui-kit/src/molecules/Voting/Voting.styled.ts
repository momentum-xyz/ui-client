import styled from 'styled-components';
import {rgba} from 'polished';

export const Button = styled.button`
  --border-color: inherit;
  --bg-color: inherit;
  --color: inherit;
  --size: inherit;

  --height: 28px;
  --radius: 14px;
  --width: 72px;
  --width-count: 40px;

  --primary-border-color: ${(props) => props.theme.accentText};
  --primary-border-color-hover: ${(props) => props.theme.accentText};
  --primary-border-color-active: transparent;
  --primary-border-color-disabled: transparent;

  --primary-bg-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
  --primary-bg-color-hover: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
  --primary-bg-color-active: ${(props) => props.theme.accentText};
  --primary-bg-color-disabled: ${(props) =>
    props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};

  --primary-color: ${(props) => props.theme.text};
  --primary-color-hover: ${(props) => props.theme.accentText};
  --primary-color-active: ${(props) => props.theme.accentBg};
  --primary-color-disabled: ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};

  --primary-label-color: ${(props) => props.theme.text};
  --primary-label-color-disabled: ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};
  --primary-label-border-color: ${(props) => props.theme.accentText};
  --primary-label-border-color-disabled: ${(props) =>
    props.theme.accentText && rgba(props.theme.accentText, 0.2)};
  --primary-label-bg-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
  --primary-label-bg-active-color: ${(props) =>
    props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};

  position: relative;
  display: flex;
  width: var(--width);
  height: var(--height);
  align-items: center;
  color: var(--color);
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  transition: all var(--tr-150-ei);

  /* VARIANTS */

  &.primary {
    --border-color: var(--primary-border-color);
    --bg-color: var(--primary-bg-color);
    --color: var(--primary-color);

    svg {
      color: var(--primary-color);
    }

    &:hover {
      --border-color: var(--primary-border-color-hover);
      --bg-color: var(--primary-bg-color-hover);
      --color: var(--primary-color-hover);

      svg {
        color: var(--primary-color-hover);
      }
    }

    &.isActive,
    &:active {
      --border-color: var(--primary-border-color-active);
      --bg-color: var(--primary-bg-color-active);
      --color: var(--primary-color-active);

      svg {
        color: var(--primary-color-active);
      }

      .count {
        background: var(--primary-label-bg-active-color);
      }
    }

    &:disabled {
      --border-color: var(--primary-border-color-disabled);
      --bg-color: var(--primary-bg-color-disabled);
      --color: var(--primary-color-disabled);

      svg {
        color: var(--primary-color-disabled);
      }
    }

    svg {
      margin: -1px 0 0 11px;
    }

    .count {
      position: absolute;
      display: flex;
      width: var(--width-count);
      height: var(--height);
      align-items: center;
      justify-content: center;
      letter-spacing: 1.12px;
      background: var(--primary-label-bg-color);
      border: 1px solid var(--primary-label-border-color);
      color: var(--primary-label-color);
      border-radius: var(--radius);
      transition: all var(--tr-150-ei);
      right: -1px;

      &.isDisabled {
        border: 1px solid var(--primary-label-border-color-disabled);
        color: var(--primary-label-color-disabled);
      }
    }
  }

  /* STATES */

  &:disabled {
    box-shadow: none;
  }
`;
