import styled from 'styled-components';
import {Avatar} from '@momentum-xyz/ui-kit';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 85px;
`;

export const MyProfileAvatar = styled(Avatar)`
  width: 23px !important;
  height: 23px !important;
  border: 1px solid white;
`;
