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

export const Item = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0 0 16px;
  height: 40px;
  min-width: 250px;

  border-bottom: 0.6px solid #fff;

  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.8)};
  &:nth-child(even) {
    background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.6)};
  }

  gap: 10px;
`;

export const ItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
  padding-right: 10px;
`;
