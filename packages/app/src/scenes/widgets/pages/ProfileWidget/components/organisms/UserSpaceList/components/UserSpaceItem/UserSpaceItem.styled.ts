import {rgba} from 'polished';
import styled from 'styled-components';
import {Text} from '@momentum/ui-kit';

export const NameText = styled(Text)``;

export const Container = styled.div`
  display: flex;
  gap: 5px;
  border-bottom: 1px ${(props) => props.theme.accent && rgba(props.theme.accent, 0.1)};
  align-items: center;
  cursor: pointer;
  padding: 5px 0;
  justify-content: left;

  :hover {
    ${NameText} {
      color: ${(props) => props.theme.accent && rgba(props.theme.accent, 1)};
    }
  }
`;
