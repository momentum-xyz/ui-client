import styled from 'styled-components';
import {rgba} from 'polished';

export const Button = styled.button`
  --border-color: inherit;
  --bg-color: inherit;
  --color: inherit;
  --height: inherit;
  --radius: inherit;
  --padding: inherit;

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

  --normal-height: 76px;
  --normal-radius: 4px;
  --normal-padding: 10px;

  padding: var(--padding);
  height: var(--height);
  width: 100%;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
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

    &:active,
    &.active {
      --border-color: var(--primary-border-color-active);
      --bg-color: var(--primary-bg-color-active);
      --color: var(--primary-color-active);

      .icon {
        background: ${(props) => props.theme.accentText};

        svg {
          color: ${(props) => props.theme.accentBg};
        }
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
  }
`;

export const Inner = styled.div`
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: 8px;
`;

export const ImageOrIcon = styled.div``;

export const Icon = styled.div`
  display: flex;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.accentBg};
  box-shadow: -1px -1px 2px 0px rgba(158, 238, 255, 0.1);
`;

export const Image = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 4px;
`;

export const TitleContainer = styled.div`
  text-align: left;
`;

export const Title = styled.div`
  white-space: nowrap;
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 1.3px;
  font-weight: 600;
`;

export const Label = styled.div`
  font-size: var(--font-size-xxs);
  letter-spacing: 0.26px;
  line-height: 18px;
  font-weight: 400;
`;
