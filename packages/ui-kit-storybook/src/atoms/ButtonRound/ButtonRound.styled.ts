import styled from 'styled-components';
import {rgba} from 'polished';

export const Button = styled.button`
  --border-color: inherit;
  --bg-color: inherit;
  --color: inherit;
  --size: inherit;

  --primary-border-color: transparent;
  --primary-border-color-hover: transparent;
  --primary-border-color-active: ${(props) => props.theme.accentText};
  --primary-border-color-disabled: transparent;
  --primary-bg-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
  --primary-bg-color-hover: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
  --primary-bg-color-active: ${(props) => props.theme.accentBg};
  --primary-bg-color-disabled: ${(props) =>
    props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};
  --primary-color: ${(props) => props.theme.text};
  --primary-color-hover: ${(props) => props.theme.accentText};
  --primary-color-active: ${(props) => props.theme.accentText};
  --primary-color-disabled: ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};

  --normal-size: 26px;

  display: flex;
  width: var(--size);
  height: var(--size);
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  color: var(--color);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2), -1px -1px 2px rgba(255, 255, 255, 0.2);

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

    &:active {
      --border-color: var(--primary-border-color-active);
      --bg-color: var(--primary-bg-color-active);
      --color: var(--primary-color-active);

      svg {
        color: var(--primary-color-active);
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
  }

  /* STATES */

  &:disabled {
    box-shadow: none;
  }

  &.label {
    pointer-events: none;
    box-shadow: -1px -1px 2px rgba(158, 238, 255, 0.1);
  }

  /* SIZES */

  &.normal {
    --size: var(--normal-size);
  }
`;
