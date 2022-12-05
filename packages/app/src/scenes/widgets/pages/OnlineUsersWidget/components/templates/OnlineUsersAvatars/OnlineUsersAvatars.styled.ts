import styled from 'styled-components';
import {Avatar, Text} from '@momentum-xyz/ui-kit';

export const Container = styled.div`
  display: flex;
  align-items: center;
`;

export const ProfileAvatar = styled(Avatar)`
  width: 23px !important;
  height: 23px !important;
  margin-left: -5px;
`;
export const UsersCount = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 23px !important;
  height: 23px !important;
  border-radius: 50%;
  color: black;
  background: ${(props) => props.theme.accent};
`;
