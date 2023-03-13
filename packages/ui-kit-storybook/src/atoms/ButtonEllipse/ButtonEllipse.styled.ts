import styled from 'styled-components';
import {rgba} from 'polished';

export const Button = styled.button`
  --border-color: inherit;
  --bg-color: inherit;
  --color: inherit;
  --height: inherit;
  --radius: inherit;
  --padding: inherit;
  --gap: inherit;

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

  --normal-height: 26px;
  --normal-radius: 14px;
  --normal-padding: 0 10px;
  --normal-gap: 10px;

  padding: var(--padding);
  display: flex;
  height: var(--height);
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  color: var(--color);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2), -1px -1px 2px rgba(255, 255, 255, 0.2);
  gap: var(--gap);

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

  /* SIZES */

  &.normal {
    --padding: var(--normal-padding);
    --height: var(--normal-height);
    --radius: var(--normal-radius);
    --gap: var(--normal-gap);

    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
`;
