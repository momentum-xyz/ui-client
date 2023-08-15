import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

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
  line-height: 22px;
  letter-spacing: 0.28px;
`;

export const Separator = styled.div`
  margin: 10px 0;
  height: 1px;
  background: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
`;

export const SubTitle = styled.div`
  font-size: var(--font-size-s);
  text-transform: uppercase;
  letter-spacing: 1.3px;
  font-weight: 600;
  line-height: 18px;
`;

export const Steps = styled.div`
  display: grid;
  grid-template-columns: 242px 1fr;
  gap: 10px 0;
`;

export const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Round = styled.div`
  display: flex;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.6)};
  justify-content: center;
  align-items: center;
`;

export const ImageContainer = styled.div`
  display: flex;
  height: 160px;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
`;

export const Image = styled.img`
  height: 100%;
`;
