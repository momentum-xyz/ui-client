import styled from 'styled-components';
import {rgba} from 'polished';

export const Message = styled.div`
  padding: 0 5px;
  color: ${(props) => props.theme.warning && rgba(props.theme.warning, 0.8)};
  font-size: var(--font-size-s);
  line-height: var(--font-size-s);
  text-align: right;
`;
