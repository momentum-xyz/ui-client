import styled from 'styled-components';
import {Text} from '@momentum-xyz/ui-kit';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 10px;
  overflow: hidden;
`;

export const Body = styled.div`
  max-height: 100%;
  overflow-y: scroll;
  width: calc(100% + 2px);
`;

export const Placeholder = styled(Text)`
  margin-left: 3px;
`;

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
