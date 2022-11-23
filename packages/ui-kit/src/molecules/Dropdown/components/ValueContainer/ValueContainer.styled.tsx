import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  --height: initial;
  --borderRadius: initial;
  --background: inherit;

  position: relative;
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 38px;
  align-items: center;
  height: var(--height);
  border-radius: var(--borderRadius);
  background: var(--background);
  cursor: pointer;
  text-align: left;
  text-transform: uppercase;
  color: ${(props) => props.theme.text};
  font-size: var(--font-size-xxs);
  font-weight: 700;
  flex-grow: 1;

  &.primary {
    --height: 26px;
    --borderRadius: 11px;
    --background: var(--color-dropdown-bg);
  }

  &.secondary {
    --height: 37px;
    --borderRadius: 5px;
    --background: ${rgba(0, 1, 1, 0.2)};
  }

  &.third {
    --height: 32px;
    --borderRadius: 10px;
    --background: ${rgba(0, 0, 0, 0.8)};
  }

  &.disabled {
    color: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.1)};
    border-color: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.1)};
    background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.1)};

    &:hover {
      cursor: not-allowed;
    }
  }
`;
