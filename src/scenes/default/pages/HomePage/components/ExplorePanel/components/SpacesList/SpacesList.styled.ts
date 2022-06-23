import styled from 'styled-components';
import {rgba} from 'polished';

import {Heading} from 'ui-kit';

export const Container = styled.div`
  height: 100%;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 5px;
    height: 0;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 6px;
    border: 5px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 0.6)};
  }
  ::-webkit-scrollbar-track {
    display: none;
  }
  ::-webkit-scrollbar-track-piece:end {
    margin-bottom: 10px;
  }
  ::-webkit-scrollbar-track-piece:start {
  }
`;

export const Category = styled.div``;

export const CategoryName = styled(Heading)`
  padding-left: 10px;
`;
