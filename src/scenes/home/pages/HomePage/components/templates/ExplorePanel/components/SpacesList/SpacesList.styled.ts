import styled from 'styled-components';

import {Heading} from 'ui-kit';

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
