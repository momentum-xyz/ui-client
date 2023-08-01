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
  gap: 10px;
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0 0 16px;
  height: 40px;

  border: 1px solid transparent;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
  box-shadow: -1px -1px 2px 0px rgba(158, 238, 255, 0.1);
  border-radius: 4px;
  gap: 10px;
`;
