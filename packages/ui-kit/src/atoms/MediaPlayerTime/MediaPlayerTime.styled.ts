import styled from 'styled-components';
import {rgba} from 'polished';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 50px auto 50px;
  color: ${(props) => props.theme.text && rgba(props.theme.text, 0.8)};
  font-size: var(--font-size-xxs);
  align-items: center;
  gap: 4px;
`;

export const Played = styled.div`
  text-align: right;
`;

export const Duration = styled.div`
  text-align: left;
`;
