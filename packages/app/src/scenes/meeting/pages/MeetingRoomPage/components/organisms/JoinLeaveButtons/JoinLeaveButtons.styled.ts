import styled from 'styled-components';
import {Button} from '@momentum-xyz/ui-kit';

export const Container = styled.div`
  padding: 12px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const ActionButton = styled(Button)`
  width: var(--meeting-size);
  margin-right: 0;
  align-self: center;
  pointer-events: auto;
`;
