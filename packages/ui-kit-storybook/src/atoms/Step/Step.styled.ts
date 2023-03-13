import styled from 'styled-components';
import {rgba} from 'polished';

export const Round = styled.div`
  --border-color: inherit;
  --bg-color: inherit;
  --color: inherit;
  --size: inherit;
  --box-shadow: none;
  --font-size: inherit;

  --normal-size: 36px;
  --normal-font-size: var(--font-size-xl);

  --active-border-color: ${(props) => props.theme.accentText};
  --active-bg-color: ${(props) => props.theme.accentBg};
  --active-color: ${(props) => props.theme.accentText};
  --active-box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.4), 0px -1px 2px rgba(255, 255, 255, 0.2);

  --next-border-color: transparent;
  --next-bg-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.6)};
  --next-color: ${(props) => props.theme.text};
  --next-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);

  --prev-border-color: transparent;
  --prev-bg-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};
  --prev-color: ${(props) => props.theme.text && rgba(props.theme.text, 0.6)};
  --prev-box-shadow: none;

  display: flex;
  width: var(--size);
  height: var(--size);
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  color: var(--color);
  font-size: var(--font-size);
  box-shadow: var(--box-shadow);

  /* VARIANTS */

  &.active {
    --border-color: var(--active-border-color);
    --bg-color: var(--active-bg-color);
    --color: var(--active-color);
    --box-shadow: var(--active-box-shadow);
  }

  &.next {
    --border-color: var(--next-border-color);
    --bg-color: var(--next-bg-color);
    --color: var(--next-color);
    --box-shadow: var(--next-box-shadow);
  }

  &.prev {
    --border-color: var(--prev-border-color);
    --bg-color: var(--prev-bg-color);
    --color: var(--prev-color);
    --box-shadow: var(--prev-box-shadow);
  }

  /* SIZES */

  &.normal {
    --size: var(--normal-size);
    --font-size: var(--normal-font-size);
  }
`;
