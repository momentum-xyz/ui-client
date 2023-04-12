import styled from 'styled-components';

export const Wrapper = styled.div`
  --scroll-offset: 290px;
`;

export const Search = styled.div`
  padding: 24px 0 0 0;
`;

export const ScrollableContainer = styled.div`
  margin: 0 10px;
  padding: 10px 0;
  height: calc(100vh - var(--scroll-offset));
  overflow: auto;
`;

export const PopularContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const BlockTitle = styled.div`
  color: ${(props) => props.theme.text};
  font-size: var(--font-size-xl);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 700;
`;

export const Carousel = styled.div``;

export const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SearchResultTitle = styled.div`
  padding: 0 0 0 10px;
  color: ${(props) => props.theme.text};
  font-size: var(--font-size-xl);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 700;
`;
