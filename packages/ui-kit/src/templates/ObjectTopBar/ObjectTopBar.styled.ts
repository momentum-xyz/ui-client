import {rgba} from 'polished';
import styled from 'styled-components';

import {SvgButton} from '../../molecules';
import {Text} from '../../atoms';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.9)};
  border-radius: 10px 10px 0px 0px;
  padding: 20px;
  width: 100%;
`;

export const Section = styled.div`
  display: flex;
  gap: 24px;
`;

export const StyledTexts = styled.div`
  display: flex;
`;

export const StyledText = styled(Text)`
  min-width: 0;
  max-width: 260px;
`;

export const Button = styled(SvgButton)`
  svg {
    color: ${(props) => props.theme.text};
  }

  :hover svg {
    color: ${(props) => props.theme.accent};
  }
`;

export const Actions = styled.div`
  flex-grow: 1;
  padding: 0 20px;
  display: flex;
  gap: 10px;
`;
