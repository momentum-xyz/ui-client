import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div``;

export const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--font-size-l);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 600;
  gap: 10px;
`;

export const Description = styled.div`
  display: grid;
  grid-template-columns: 1fr 90px;
  gap: 10px;
  line-height: 22px;
  letter-spacing: 0.28px;

  button {
    transform: scale(1.2);
  }
`;

export const Hexagon = styled.div`
  display: flex;
  width: 90px;
  height: 90px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  border: 1px solid ${(props) => props.theme.accentText};
`;

export const Separator = styled.div`
  margin: 10px 0;
  height: 1px;
  background: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
`;

export const SubTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--font-size-s);
  text-transform: uppercase;
  letter-spacing: 1.3px;
  font-weight: 600;
  line-height: 18px;
  gap: 10px;
`;
