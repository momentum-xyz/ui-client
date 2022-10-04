import styled from 'styled-components';
import {ExpandableLayout} from '@momentum/ui-kit';

export const CustomExpandableLayout = styled(ExpandableLayout)`
  pointer-events: all;
`;

export const WorldNameContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 7px 10px;
  gap: 5px;
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
