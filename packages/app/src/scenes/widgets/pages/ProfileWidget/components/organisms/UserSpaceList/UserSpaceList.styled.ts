import styled from 'styled-components';
import {Text} from '@momentum-xyz/ui-kit';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

export const Body = styled.div`
  max-height: 100%;
`;

export const Placeholder = styled(Text)`
  margin-left: 3px;
`;

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
