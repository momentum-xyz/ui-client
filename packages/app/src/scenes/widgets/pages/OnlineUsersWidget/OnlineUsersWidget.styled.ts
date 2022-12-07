import styled from 'styled-components';
import {Avatar} from '@momentum-xyz/ui-kit';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  cursor: pointer;
`;

export const MyProfileAvatar = styled(Avatar)`
  width: 23px !important;
  height: 23px !important;
  margin-left: -5px;
`;

export const AvatarsWrapper = styled.div`
  display: flex;
  width: 100%;
`;
