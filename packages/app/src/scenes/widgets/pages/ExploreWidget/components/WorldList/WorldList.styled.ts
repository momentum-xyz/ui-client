import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 0 10px;
`;

export const PopularContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const BlockTitle = styled.div`
  color: ${(props) => props.theme.text};
  line-height: var(--font-size-xl);
  font-size: var(--font-size-xl);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 700;
`;

export const BlockTitleTwo = styled.div`
  padding: 10px 0 0 0;
  color: ${(props) => props.theme.text};
  line-height: var(--font-size-xl);
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
  display: flex;
  justify-content: space-between;
  color: ${(props) => props.theme.text};
  font-size: var(--font-size-xl);
  line-height: var(--font-size-xl);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 700;
`;
