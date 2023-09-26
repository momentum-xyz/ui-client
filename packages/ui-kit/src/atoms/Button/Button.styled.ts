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
  --primary-bg-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
  --primary-bg-color-hover: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
  --primary-bg-color-active: ${(props) => props.theme.accentBg};
  --primary-bg-color-disabled: ${(props) =>
    props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};
  --primary-color: ${(props) => props.theme.text};
  --primary-color-hover: ${(props) => props.theme.accentText};
  --primary-color-active: ${(props) => props.theme.accentText};
  --primary-color-disabled: ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};

  --secondary-border-color: ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};
  --secondary-border-color-hover: ${(props) => props.theme.accentText};
  --secondary-border-color-active: ${(props) => props.theme.accentText};
  --secondary-border-color-disabled: ${(props) => props.theme.text && rgba(props.theme.text, 0.2)};
  --secondary-bg-color: transparent;
  --secondary-bg-color-hover: transparent;
  --secondary-bg-color-active: transparent;
  --secondary-bg-color-disabled: ${(props) =>
    props.theme.accentText && rgba(props.theme.accentText, 0.2)};
  --secondary-color: ${(props) => props.theme.text};
  --secondary-color-hover: ${(props) => props.theme.accentText};
  --secondary-color-active: ${(props) => props.theme.accentText};
  --secondary-color-disabled: ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};

  --third-border-color: ${(props) => props.theme.accentBg};
  --third-border-color-hover: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
  --third-border-color-active: ${(props) =>
    props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
  --third-border-color-disabled: ${(props) =>
    props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};
  --third-bg-color: transparent;
  --third-bg-color-hover: transparent;
  --third-bg-color-active: transparent;
  --third-bg-color-disabled: transparent;
  --third-color: ${(props) => props.theme.accentBg};
  --third-color-hover: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
  --third-color-active: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
  --third-color-disabled: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};

  --normal-height: 40px;
  --normal-radius: 4px;
  --normal-padding: 0 20px;
  --normal-gap: 10px;

  padding: var(--padding);
  display: flex;
  height: var(--height);
  align-items: center;
  justify-content: start;
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

    &:active,
    &.active {
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

  &.secondary {
    --border-color: var(--secondary-border-color);
    --bg-color: var(--secondary-bg-color);
    --color: var(--secondary-color);

    svg {
      color: var(--secondary-color);
    }

    &:hover {
      --border-color: var(--secondary-border-color-hover);
      --bg-color: var(--secondary-bg-color-hover);
      --color: var(--secondary-color-hover);

      svg {
        color: var(--secondary-color-hover);
      }
    }

    &:active {
      --border-color: var(--secondary-border-color-active);
      --bg-color: var(--secondary-bg-color-active);
      --color: var(--secondary-color-active);

      svg {
        color: var(--secondary-color-active);
      }
    }

    &:disabled {
      --border-color: var(--secondary-border-color-disabled);
      --bg-color: var(--secondary-bg-color-disabled);
      --color: var(--secondary-color-disabled);

      svg {
        color: var(--secondary-color-disabled);
      }
    }
  }

  &.third {
    --border-color: var(--third-border-color);
    --bg-color: var(--third-bg-color);
    --color: var(--third-color);

    svg {
      color: var(--third-color);
    }

    &:hover {
      --border-color: var(--third-border-color-hover);
      --bg-color: var(--third-bg-color-hover);
      --color: var(--third-color-hover);

      svg {
        color: var(--third-color-hover);
      }
    }

    &:active {
      --border-color: var(--third-border-color-active);
      --bg-color: var(--third-bg-color-active);
      --color: var(--third-color-active);

      svg {
        color: var(--third-color-active);
      }
    }

    &:disabled {
      --border-color: var(--third-border-color-disabled);
      --bg-color: var(--third-bg-color-disabled);
      --color: var(--third-color-disabled);

      svg {
        color: var(--third-color-disabled);
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

    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &.wide {
    width: 100%;
    justify-content: center;
  }
`;
