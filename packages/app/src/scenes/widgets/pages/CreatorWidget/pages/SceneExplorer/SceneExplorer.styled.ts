import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div``;

export const Description = styled.div`
  line-height: 22px;
  margin-bottom: 30px;
  padding: 10px;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
`;

export const IconButtonPlaceholder = styled.div`
  width: 14px;
  height: 14px;
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  padding: 0 10px;
  height: 40px;
  min-width: 250px;
  transition: all var(--tr-150-ei);

  border-bottom: 0.6px solid #fff;

  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
  &:nth-child(even) {
    background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.6)};
  }
  &:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  gap: 10px;
`;

export const ItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
`;
