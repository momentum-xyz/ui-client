import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  position: relative;
`;

export const ItemLink = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

export const ItemName = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  color: ${(props) => props.theme.text};
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
  font-size: var(--font-size-xl);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 700;
  bottom: 34px;
  right: 0;
  left: 0;
`;
