import styled from 'styled-components';
import {Button} from '@momentum-xyz/ui-kit';

export const Buttons = styled.div`
  display: flex;

  &.base {
    justify-content: space-between;
    margin-right: 20px;
    width: 100%;
  }

  :not(.base) {
    gap: 10px;
  }
`;

export const EventButton = styled(Button)`
  max-width: 200px;
  min-width: 150px;
`;

export const LiveIndicator = styled.div`
  display: flex;
  gap: 5px;
  background: var(--danger-red);
  padding: 0 10px;
  border-radius: 5px;
  color: var(--white);
  font-weight: bold;
  text-transform: uppercase;
  align-items: center;
`;
