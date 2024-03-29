import styled from 'styled-components';

export const Grid = styled.div`
  display: grid;

  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
  flex-grow: 1;
  gap: 5px;
  overflow: hidden;
`;

export const GridItem = styled.div`
  width: 152px;
`;

export const GridItemInnerContainer = styled.button`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const GridItemImage = styled.img`
  width: 100px;
  height: 100px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  object-fit: cover;
`;

export const GridItemPreview = styled.div`
  width: 100%;
  height: 140px;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.text};
  border-radius: 4px;
`;

export const EmptyResult = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ObjectName = styled.span`
  width: 140px;
  text-align: center;
  color: ${(props) => props.theme.text};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
