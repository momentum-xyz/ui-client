import {rgba} from 'polished';
import styled from 'styled-components';

export const TokenSelectorWrapper = styled.div`
  background: ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.1)};
  padding: 8px 10px;
  border-radius: 4px;
`;
