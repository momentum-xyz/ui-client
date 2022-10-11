import styled from 'styled-components';
import {rgba} from 'polished';

export const Div = styled.div`
  display: grid;
  grid-gap: 10px;
`;

export const Components = styled.div`
  height: calc(100vh - 140px);
  overflow: auto;
`;

export const Name = styled.div`
  padding: 10px 20px;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.6)};
  border-radius: 10px;
`;

export const Section = styled.div`
  position: relative;
  margin: 15px 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const SectionGrid3 = styled.div`
  margin: 15px 0;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  display: grid;
  flex-wrap: wrap;
  gap: 12px;
`;

export const SectionGrid2 = styled.div`
  margin: 15px 0;
  width: 100%;
  grid-template-columns: repeat(2, 1fr);
  display: grid;
  flex-wrap: wrap;
  gap: 12px;
`;
