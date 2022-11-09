import styled from 'styled-components';
import {Heading} from '@momentum-xyz/ui-kit';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 7px 10px;
  gap: 5px;
`;

export const Container = styled.div`
  height: 100%;
  overflow-y: scroll;
  ::-webkit-scrollbar-track-piece:end {
    margin-bottom: 7px;
  }
`;

export const Category = styled.div``;

export const CategoryName = styled(Heading)`
  padding-left: 10px;
`;
