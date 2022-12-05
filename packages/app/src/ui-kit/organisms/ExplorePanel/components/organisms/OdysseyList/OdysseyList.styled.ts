import styled from 'styled-components';
import {Text} from '@momentum-xyz/ui-kit';
import {rgba} from 'polished';

export const Inner = styled.div`
  padding: 0 10px;
  pointer-events: all;
`;

export const StyledText = styled(Text)``;

export const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  border-bottom: 1px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 0.1)};
  padding: 6px 0;
`;

export const InfoContainer = styled.div`
  display: flex;
  width: calc(10 * (100% / 12));
  cursor: pointer;
  align-items: center;
  gap: 10px;

  :hover {
    ${StyledText} {
      color: ${(props) => props.theme.accent && rgba(props.theme.accent, 1)};
    }
  }
`;
