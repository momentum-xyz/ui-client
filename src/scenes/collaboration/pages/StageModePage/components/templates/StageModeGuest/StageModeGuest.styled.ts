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
`;

export const InnerBody = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const PopupQueueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0px 40px;
  gap: 20px;
  flex-grow: 1;
`;

export const StageModeMessageText = styled(Text)`
  white-space: pre-line;
  opacity: 50%;
  align-self: center;
`;

export const StageModeContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;
