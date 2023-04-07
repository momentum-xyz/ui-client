import styled from 'styled-components';
import {rgba} from 'polished';

export const Wrapper = styled.div`
  --scroll-offset: 290px;
`;

export const Search = styled.div`
  padding: 24px 0 0 0;
`;

export const WorldsContainer = styled.div`
  padding: 10px;
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

export const SearchResultItem = styled.div`
  padding: 10px;
  display: grid;
  grid-template-columns: 170px 1fr;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};
  box-shadow: -1px -1px 2px rgba(158, 238, 255, 0.1);
  border-radius: 4px;
  gap: 20px;
`;

export const ItemContent = styled.div`
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.text};
  gap: 10px;
`;

export const ItemName = styled.div`
  font-size: var(--font-size-xl);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 700;
`;

export const ItemDesc = styled.div``;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
`;
