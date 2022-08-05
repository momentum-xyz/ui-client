import styled from 'styled-components';

import {Text} from 'ui-kit';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: auto;
`;

export const Body = styled.div`
  display: flex;
  height: 100%;
  padding: 10px 0 0 0;
`;

export const InnerBody = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const PopupQueueContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const StageModeNotActiveText = styled(Text)`
  opacity: 50%;
`;

export const StageContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  z-index: 0;
  justify-content: center;
`;

export const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 40px;
  gap: 20px;
  flex-grow: 1;
`;

export const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
