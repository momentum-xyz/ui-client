import styled from 'styled-components';
import {SearchInput} from '@momentum-xyz/ui-kit';

export const Body = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 522px;
  gap: 40px;
  height: 100%;
  padding-bottom: 80px;
`;

export const TokenRuleSearch = styled(SearchInput)`
  margin: 0 20px;
`;

export const Container = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 20px;
  padding-top: 10px;
  gap: 10px;
`;
