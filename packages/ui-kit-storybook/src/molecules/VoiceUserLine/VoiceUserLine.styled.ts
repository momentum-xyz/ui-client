import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  padding: 0 10px;
  display: grid;
  height: 65px;
  border-radius: 4px;
  text-transform: uppercase;
  color: ${(props) => props.theme.text};
  grid-template-columns: 42px 1fr 30px;
  font-size: var(--font-size-l);
  font-weight: 500;
  letter-spacing: 0.2em;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};
  gap: 10px;
`;

export const Hexagon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TitleContainer = styled.div`
  min-width: 0;
  flex-direction: column;
  justify-content: center;
  align-self: center;
  align-items: start;
  overflow: hidden;
`;

export const Title = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
