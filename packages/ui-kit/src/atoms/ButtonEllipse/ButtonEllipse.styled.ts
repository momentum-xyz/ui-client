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

  --primary-border-color: ${(props) => props.theme.accentText};
  --primary-border-color-hover: transparent;
  --primary-border-color-active: ${(props) => props.theme.accentText};
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
  --primary-border-color-disabled: transparent;

  --secondary-border-color: transparent;
  --secondary-border-color-hover: transparent;
  --secondary-border-color-active: ${(props) => props.theme.accentText};

  --secondary-bg-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
  --secondary-bg-color-hover: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
  --secondary-bg-color-active: ${(props) => props.theme.accentText};
  --secondary-bg-color-disabled: ${(props) =>
    props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};

  --secondary-color: ${(props) => props.theme.text};
  --secondary-color-hover: ${(props) => props.theme.accentText};
  --secondary-color-active: ${(props) => props.theme.accentBg};
  --secondary-color-disabled: ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};

  --thirty-border-color: ${(props) => props.theme.text};
  --thirty-border-color-hover: ${(props) => props.theme.accentText};
  --thirty-border-color-active: ${(props) => props.theme.accentBg};
  --thirty-border-color-disabled: ${(props) => props.theme.text && rgba(props.theme.text, 0.2)};

  --thirty-bg-color: transparent;
  --thirty-bg-color-hover: transparent;
  --thirty-bg-color-active: transparent;
  --thirty-bg-color-disabled: transparent;

  --thirty-color: ${(props) => props.theme.text};
  --thirty-color-hover: ${(props) => props.theme.accentText};
  --thirty-color-active: ${(props) => props.theme.accentBg};
  --thirty-color-disabled: ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};
  --thirty-border-color-disabled: ${(props) => props.theme.text && rgba(props.theme.text, 0.2)};

  --normal-height: 26px;
  --normal-radius: 14px;
  --normal-padding: 0 9px;
  --normal-padding-only-icon: 0 7px;
  --normal-gap: 7px;

  padding: var(--padding);
  display: flex;
  height: var(--height);
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-size: var(--font-size-m);
  line-height: var(--font-size-m);
  color: var(--color);
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

    &.active,
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

    &.active,
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

  &.thirty {
    --border-color: var(--thirty-border-color);
    --bg-color: var(--thirty-bg-color);
    --color: var(--thirty-color);

    svg {
      color: var(--thirty-color);
    }

    &:hover {
      --border-color: var(--thirty-border-color-hover);
      --bg-color: var(--thirty-bg-color-hover);
      --color: var(--thirty-color-hover);

      svg {
        color: var(--thirty-color-hover);
      }
    }

    &.active,
    &:active {
      --border-color: var(--thirty-border-color-active);
      --bg-color: var(--thirty-bg-color-active);
      --color: var(--thirty-color-active);

      svg {
        color: var(--thirty-color-active);
      }
    }

    &:disabled {
      --border-color: var(--thirty-border-color-disabled);
      --bg-color: var(--thirty-bg-color-disabled);
      --color: var(--thirty-color-disabled);

      svg {
        color: var(--thirty-color-disabled);
      }
    }
  }

  /* STATES */

  &:disabled {
    box-shadow: none;
  }

  &.wide {
    padding: 0 10px;
    width: 100%;
    justify-content: flex-start;
  }

  &.label {
    pointer-events: none;
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

    &.only-icon {
      --padding: var(--normal-padding-only-icon);
      width: var(--normal-height);
    }
  }
`;

export const Label = styled.span`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
