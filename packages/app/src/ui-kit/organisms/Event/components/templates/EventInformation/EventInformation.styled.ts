import styled from 'styled-components';
import {Avatar, Text} from '@momentum-xyz/ui-kit';

export const ContentRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
`;

export const TextRow = styled.div`
  max-width: 50%;
  margin-bottom: 10px;
`;

export const DateRow = styled.div`
  margin: 10px 0;
  display: flex;
  gap: 5px;
  flex-shrink: 0;
  width: max-content;
`;

export const AttendeesContainer = styled.div`
  display: grid;
  grid-row-gap: 20px;
  grid-column-gap: 10px;
  grid-template-columns: 70px 70px 70px 70px 70px;
  grid-template-rows: 70px;
  grid-auto-flow: dense;
  transform: rotateY(180deg);
  margin-top: 60px;
`;

export const AttendeeAvatar = styled(Avatar)`
  width: 40px !important;
  height: 40px !important;
  border: 2px solid ${(props) => props.theme.accent};
`;

export const AttendeeNameText = styled(Text)`
  width: inherit;
`;

export const AttendeeContrainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
  overflow: hidden;
  gap: 10px;
  transform: rotateY(180deg);
`;

export const MoreAttendees = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px !important;
  height: 40px !important;
  border-radius: 50%;
  border: 2px solid ${(props) => props.theme.accent};
`;

export const AttendeesCount = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px !important;
  height: 30px !important;
  border-radius: 50%;
  color: black;
  background: ${(props) => props.theme.accent};
`;

export const EventTitle = styled(Text)`
  margin-bottom: 10px;
`;
