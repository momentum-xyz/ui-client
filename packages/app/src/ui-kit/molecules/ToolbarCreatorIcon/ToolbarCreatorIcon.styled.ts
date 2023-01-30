import {rgba} from 'polished';
import styled from 'styled-components';

export const ActiveIconsContainer = styled.div`
  position: relative;
  padding: 0 32px 0 0;
  display: flex;
  gap: inherit;
  height: 100%;
  align-items: center;
  border-radius: inherit;
`;

export const ActiveIcons = styled.div`
  position: absolute;
  padding: 11px 20px 11px 12px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.3)};
  right: -16px;
`;

export const StandoutBuilderModeContainer = styled.div`
  position: absolute;
  right: -16px;
  padding: 15px 30px;
  bottom: 84px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.3)};
`;
