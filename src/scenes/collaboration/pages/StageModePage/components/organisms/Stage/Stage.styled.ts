import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 10px;
  max-height: 80vh;
  max-width: 142vh;
`;

export const Grid = styled.div`
  display: grid;
  width: 100%;
  max-height: 100%;
  align-items: center;

  &.cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  &.cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &.cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  &.cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;
