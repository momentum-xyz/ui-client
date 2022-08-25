import styled from 'styled-components';
import {rgba} from 'polished';

export const Div = styled.div`
  display: grid;
  grid-gap: 10px;
`;

export const Components = styled.div`
  height: calc(100vh - 270px);
  overflow: auto;
`;

export const Name = styled.div`
  padding: 10px 20px;
  width: 50%;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.6)};
  border-radius: 10px;
`;

export const Section = styled.div`
  margin: 15px 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;
