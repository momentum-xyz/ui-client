import styled from 'styled-components';

export const Wrapper = styled.div`
  --scroll-offset: 350px;
`;

export const Search = styled.div`
  padding: 24px 0 0 0;
`;

export const Filters = styled.div`
  padding: 12px 0 0 0;
  display: flex;
  gap: 10px;
}
`;

export const ScrollableContainer = styled.div`
  margin: 0 10px;
  padding: 10px 0;
  height: calc(100vh - var(--scroll-offset));
  overflow: auto;
`;

export const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
