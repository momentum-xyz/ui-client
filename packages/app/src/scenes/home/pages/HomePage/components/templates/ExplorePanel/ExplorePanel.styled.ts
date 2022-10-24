import styled from 'styled-components';
import {ExpandableLayout} from '@momentum-xyz/ui-kit';

export const CustomExpandableLayout = styled(ExpandableLayout)`
  pointer-events: all;
`;

export const Loader = styled.div`
  height: 160px;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;
