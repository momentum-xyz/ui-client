import styled from 'styled-components';

export const Wrapper = styled.div`
  position: absolute;
  bottom: -70px;
  right: 0;
  left: 0;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 40px;
  align-items: center;
`;

export const GridItem = styled.div`
  padding: 0 12px;
`;
