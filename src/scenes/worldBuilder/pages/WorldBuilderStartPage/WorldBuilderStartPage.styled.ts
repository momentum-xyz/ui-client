import styled from 'styled-components';

import {Text} from 'ui-kit';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  gap: 20px;
  overflow-y: scroll;
`;

export const Information = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

export const Description = styled(Text)`
  max-width: 950px;
`;

export const Spacer = styled.div``;
