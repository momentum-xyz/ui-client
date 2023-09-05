import styled from 'styled-components';

export const Container = styled.div``;

export const Search = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Sorting = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  button {
    justify-content: left !important;
  }
`;
