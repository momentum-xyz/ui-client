import styled from 'styled-components';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 48% 48%;
  grid-gap: 15px;
`;

export const GridItem = styled.div`
  position: relative;
  padding: 8px 10px;
  background-image: linear-gradient(${(props) => props.theme.bg}, transparent);
  border-radius: 11px;
`;

export const Title = styled.div`
  position: absolute;
  top: -30px;
  left: 5px;
`;
