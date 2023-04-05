import styled from 'styled-components';
import {Text, Avatar, IconSvg} from '@momentum-xyz/ui-kit';

export const Attendee = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const AttendeeAvatar = styled(Avatar)`
  border-color: ${(props) => props.theme.accentText} !important;
  border-width: 2px !important;
`;

export const AttendeeName = styled(Text)`
  overflow: hidden;
  width: 60px;
`;

export const MutedIcon = styled(IconSvg)`
  position: absolute;
  transform: translateY(5px);
  color: ${(props) => props.theme.text};
`;
