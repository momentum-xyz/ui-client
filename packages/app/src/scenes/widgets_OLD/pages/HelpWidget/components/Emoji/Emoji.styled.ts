import styled from 'styled-components';
import {rgba} from 'polished';

export const Block = styled.div`
  display: grid;
  grid-template-columns: 55% auto;
  grid-gap: 20px;
`;

export const TextItem = styled.div`
  font-size: var(--font-size-s);
  padding: 10px 0 0 0;
`;

export const TextItemLast = styled.div`
  font-size: var(--font-size-s);
  padding: 10px 0 15px 0;
`;

export const HighlightedSpan = styled.span`
  font-size: var(--font-size-m);
  font-weight: bold;
  color: ${(props) => props.theme.accentText};
  cursor: pointer;
`;

export const EmojiContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const EmojiList = styled.div`
  padding: 10px;
  display: flex;
  height: 55px;
  flex-wrap: wrap;
  gap: 5px;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.accentText};
  background-color: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.2)};
`;

export const Emoji = styled.div`
  width: 14px;
  height: 14px;
`;

export const EmojiImg = styled.img`
  width: 100%;
  height: 100%;
`;

export const EmojiButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const SmileContainer = styled.div`
  padding: 4px 20px;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.accentText};
  background-color: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.2)};
`;

export const ArrowContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;
