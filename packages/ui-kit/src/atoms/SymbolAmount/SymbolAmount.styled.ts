import styled from 'styled-components';
import {rgba} from 'polished';

export const ItemValue = styled.div`
  padding: 8px 10px;
  display: flex;
  justify-content: flex-end;
  color: ${(props) => props.theme.text};
  border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.4)};
  border-radius: 4px;
  font-weight: 700;
`;

export const ItemSuffix = styled.div`
  padding: 0 0 0 5px;
  display: inline-block;
  font-weight: 400;
`;
