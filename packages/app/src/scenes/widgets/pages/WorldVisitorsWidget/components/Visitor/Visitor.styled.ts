import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  margin: 1px;
  border-radius: 4px;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.6)};
  box-shadow: -1px -1px 2px rgba(158, 238, 255, 0.1);
`;

export const Inner = styled.div`
  padding: 0 10px;
  display: grid;
  height: 65px;
  text-transform: uppercase;
  color: ${(props) => props.theme.text};
  grid-template-columns: 42px 1fr auto;
  font-size: var(--font-size-l);
  font-weight: 600;
  letter-spacing: 0.2em;
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
  gap: 6px;
`;

export const Details = styled.div`
  padding: 0 20px 10px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Line = styled.div`
  padding: 2px 0 10px 0;
  border-bottom: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.2)};
`;

export const Bio = styled.div`
  line-height: 22px;
`;

export const Link = styled.a`
  padding: 0;
`;

export const SubActions = styled.div`
  padding: 0 0 10px 0;
  display: flex;
  gap: 16px;
`;
