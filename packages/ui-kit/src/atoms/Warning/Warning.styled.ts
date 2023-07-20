import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  padding: 10px;
  display: flex;
  width: 320px;
  border-radius: 4px;
  background: ${(props) => props.theme.danger && rgba(props.theme.danger, 0.6)};
  color: ${(props) => props.theme.text};
  font-size: var(--font-size-s);
  letter-spacing: 0.02em;
  line-height: 18px;
  gap: 10px;

  &.wide {
    width: 100%;
  }

  svg {
    margin: 1px 0 0 0;
  }
`;
