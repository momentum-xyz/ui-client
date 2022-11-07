import {Heading} from '@momentum-xyz/ui-kit';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  width: 480px;
  gap: 10px;
`;

export const IconSelector = styled.div`
  display: flex;
  width: 100%;
  overflow-x: scroll;
  gap: 5px;
  padding: 0 5px;
`;

export const IconHeading = styled(Heading)`
  padding-left: 10px;
`;

export const IconItem = styled.div`
  padding: 2px;
  &.selected {
    background-color: gray;
  }
`;
