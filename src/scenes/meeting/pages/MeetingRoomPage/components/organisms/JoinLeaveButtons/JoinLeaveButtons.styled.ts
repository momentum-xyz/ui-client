import styled from 'styled-components';

import {Button} from 'ui-kit';

export const Container = styled.div`
  padding: 20px 0 0 0;
`;

export const ActionButton = styled(Button)`
  width: var(--meeting-size);
  margin-right: 0;
  align-self: center;
  pointer-events: auto;
`;
