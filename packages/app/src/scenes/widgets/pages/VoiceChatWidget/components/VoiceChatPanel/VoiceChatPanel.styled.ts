import {Text} from '@momentum-xyz/ui-kit';
import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
`;

export const Body = styled.div`
  flex-grow: 1;
  overflow-y: scroll;

  display: grid;

  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-rows: 80px;
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const EnterLeaveButton = styled.button`
  display: flex;
  width: 100%;
  height: 55px;
  justify-content: center;
  align-items: center;

  background: ${(props) => props.theme.accent && rgba(props.theme.accent, 0.1)};
  border: 1px solid ${(props) => props.theme.accent};

  border-left: 0;
  border-right: 0;
`;

export const VoiceActions = styled.div`
  display: flex;
  height: 48px;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

export const VoiceAction = styled.button`
  display: flex;
  gap: 6px;
  align-items: center;

  :disabled {
    opacity: 0.8;
  }

  svg {
    color: white;
  }
`;

export const EnterLeaveButtonLabel = styled(Text)`
  color: ${(props) => props.theme.accent};
`;
