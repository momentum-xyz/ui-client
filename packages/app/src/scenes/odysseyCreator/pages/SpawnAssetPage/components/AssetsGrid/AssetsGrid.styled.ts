import styled from 'styled-components';

export const Grid = styled.div`
  display: grid;

  grid-template-columns: 1fr 1fr 1fr 1fr;
  width: 100%;
  flex-grow: 1;
`;

export const GridItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 15px;
  align-items: center;
`;

export const GridItemImage = styled.img`
  width: 130px;
  height: 130px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  border-radius: 10px;
  object-fit: cover;
`;

export const GridItemPreview = styled.div`
  width: 130px;
  height: 130px;
  border-radius: 10px;
`;
