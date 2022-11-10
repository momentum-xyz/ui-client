import styled from 'styled-components';
import {ExpandableLayout} from '@momentum-xyz/ui-kit';

export const CustomExpandableLayout = styled(ExpandableLayout)`
  pointer-events: all;
`;

export const Loader = styled.div`
  height: 160px;
  padding: 0 0 15px 0px;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

export const Heading = styled.div`
  display: flex;
  align-items: center;
  padding: 7px 10px;
  gap: 5px;
`;

export const EmptyResult = styled.div`
  height: 160px;
  padding: 0 0 15px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
