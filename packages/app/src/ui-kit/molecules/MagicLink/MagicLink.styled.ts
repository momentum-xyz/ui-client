import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  --padding: 0 8px;
  --radius: 11px;
  --height: 26px;

  display: grid;
  padding: var(--padding);
  width: 100%;
  height: var(--height);
  grid-template-columns: 18px 1fr;
  align-items: center;
  border-radius: var(--radius);
  background: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.1)};
  font-size: var(--font-size-xxs);
  text-transform: uppercase;
  color: ${(props) => props.theme.text};

  span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
