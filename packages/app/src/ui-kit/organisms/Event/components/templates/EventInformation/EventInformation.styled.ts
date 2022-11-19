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
  grid-column-gap: 5px;
  grid-template-columns: 70px 70px 70px 70px;
  grid-template-rows: 70px;
  grid-auto-flow: dense;
  transform: rotateY(180deg);
  margin-top: 60px;
`;

export const AttendeeAvatar = styled(Avatar)`
  width: 40px !important;
  height: 40px !important;
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
