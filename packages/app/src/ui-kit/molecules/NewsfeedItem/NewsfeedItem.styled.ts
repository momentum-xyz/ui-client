import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  padding: 10px 0 4px 0;
  display: flex;
  border-bottom: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.2)};
  flex-direction: row;
  gap: 8px;
`;
