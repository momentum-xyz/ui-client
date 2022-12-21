import styled from 'styled-components';
import {Text} from '@momentum-xyz/ui-kit';

export const Container = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border-bottom: 1px solid rgba(255, 242, 241, 0.2);
`;

export const Info = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  cursor: pointer;
  &.noPointer {
    cursor: default;
  }
`;

export const Toolbar = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

export const AdminText = styled(Text)`
  padding-right: 5px;
`;
