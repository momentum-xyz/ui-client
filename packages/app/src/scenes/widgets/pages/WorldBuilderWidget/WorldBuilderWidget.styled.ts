import {rgba} from 'polished';
import styled from 'styled-components';

export const ActiveIconsContainer = styled.div`
  display: flex;
  gap: inherit;
  height: 100%;
  align-items: center;
  padding: 0 14px;
  border-radius: inherit;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.25)};
  position: relative;
`;

export const StandoutBuilderModeContainer = styled.div`
  position: absolute;
  right: 5px;
  padding: 15px 30px;
  bottom: 70px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.35)};
`;
