import styled from 'styled-components';
import {rgba} from 'polished';

export const FeedItem = styled.div`
  padding: 10px 0 4px 0;
  display: flex;
  border-bottom: 1px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 0.2)};
  flex-direction: row;
  gap: 8px;
`;
