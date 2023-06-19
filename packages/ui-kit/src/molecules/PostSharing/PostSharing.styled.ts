import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  padding: 0 10px 16px 10px;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  color: ${(props) => props.theme.text};
  background: ${(props) => props.theme.accentBg};
  box-shadow: -1px -1px 2px rgba(158, 238, 255, 0.1);
  gap: 16px;
`;

export const Header = styled.div`
  padding: 16px 0 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: var(--font-size-s);
  font-weight: 600;
`;

export const Content = styled.div`
  display: flex;
  gap: 10px;
`;

export const Copy = styled.div`
  display: grid;
  grid-template-columns: 1fr 40px;
  align-items: center;
  gap: 10px;
`;

export const Url = styled.div`
  padding: 10px 20px;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
