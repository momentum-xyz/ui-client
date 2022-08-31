import styled from 'styled-components';

import {SearchInput} from 'ui-kit/index';

export const Container = styled.div`
  padding-right: 10px;
  padding-left: 10px;
  margin: 10px;
  width: 522px;
  height: 65vh;
`;

export const HeadingItem = styled.div`
  padding-top: 20px;
`;

export const Dialog = styled.div`
  padding: 40px;
`;

export const Div = styled.div``;
export const TokenDetailGrid = styled.div`
  padding-top: 30px;
  width: 100%;

  .token-rule-title {
    color: var(--white);
    width: 25%;
    padding: 0 0 0 0;
  }

  .token-rule-detail {
    white-space: nowrap;
    color: ${(props) => props.theme.accent};
    width: 30%;
    padding: 0 0 0 20px;
    margin-bottom: 1px;
  }
`;
export const GridItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0 34px 20px;
`;
export const TextItem = styled.div``;

export const StyledSearchInput = styled(SearchInput)``;
