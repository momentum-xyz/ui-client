import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const NewItem = styled.div`
  display: flex;
  color: ${(props) => props.theme.text};
  flex-direction: row;
  gap: 10px;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

export const ListItemValue = styled.div`
  padding: 6px 10px;
  border-radius: 4px;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.2)};
  color: ${(props) => props.theme.text};
  font-size: var(--font-size-s);
  line-height: 18px;
`;
