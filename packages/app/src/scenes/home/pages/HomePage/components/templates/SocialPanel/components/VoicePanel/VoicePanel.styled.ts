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

export const Attendee = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const AttendeeName = styled(Text)`
  overflow: hidden;
  width: 60px;
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
  height: 55px;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

export const VoiceAction = styled.button`
  display: flex;
  gap: 10px;
  align-items: center;

  svg {
    color: white;
  }
`;

export const EnterLeaveButtonLabel = styled(Text)`
  color: ${(props) => props.theme.accent};
`;
