import styled from 'styled-components';
import {rgba} from 'polished';

export const StepActions = styled.div`
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
  gap: 65px;
`;

export const StepAction = styled.div``;
