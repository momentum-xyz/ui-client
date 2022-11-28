import {rgba} from 'polished';
import styled from 'styled-components';

import {Text} from '../../atoms';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.9)};
  border-radius: 10px 10px 0px 0px;
  padding: 20px;
`;

export const Section = styled.div`
  display: flex;
  gap: 10px;
`;

export const StyledTexts = styled.div`
  display: flex;
`;

export const StyledText = styled(Text)`
  min-width: 0;
`;
