import {rgba} from 'polished';
import styled from 'styled-components';

export const Round = styled.div`
  display: flex;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.6)};
  font-size: var(--font-size-m);
  font-weight: 400;
`;
