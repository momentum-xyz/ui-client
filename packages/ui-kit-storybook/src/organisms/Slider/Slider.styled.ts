import styled from 'styled-components';

export const Container = styled.div`
  --image-height: 124px;

  position: relative;
  margin: 0 -5px;
`;

export const ItemLink = styled.div`
  padding: 0 5px;

  &:hover {
    cursor: pointer;
  }
`;

export const ItemName = styled.div`
  position: absolute;
  display: flex;
  justify-content: flex-start;
  color: ${(props) => props.theme.text};
  font-size: var(--font-size-s);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  bottom: 12px;
  right: 15px;
  left: 15px;

  > span {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

export const ItemImage = styled.img`
  width: 100%;
  height: var(--image-height);
  border-radius: 4px;
  object-fit: cover;
`;
