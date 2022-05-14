import styled from 'styled-components';
import {rgba} from 'polished';

import {SearchInput} from 'ui-kit/index';

export const Container = styled.div`
  padding-right: 10px;
  padding-left: 10px;
  margin: 10px;
  width: 522px;
  height: 591px;

  .SearchInput-custom {
    background: ${rgba(0, 1, 1, 0.2)};
  }
`;

export const Item = styled.div`
  padding-top: 20px;
`;

export const Dialog = styled.div`
  padding: 40px;
`;

export const Div = styled.div``;

export const TextItem = styled.div``;

export const StyledSearchInput = styled(SearchInput)``;
