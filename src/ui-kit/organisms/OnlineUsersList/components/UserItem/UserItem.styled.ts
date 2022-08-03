import {rgba} from 'polished';
import styled from 'styled-components';

import {Text} from 'ui-kit';

export const StyledText = styled(Text)``;

export const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  border-bottom: 1px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 0.1)};
  padding: 6px 10px;
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

  &.invite {
    ${StyledText} {
      width: 12ch;
      cursor: default;
    }

    :hover {
      ${StyledText} {
        color: white;
      }
    }
  }
`;

export const InviteButtonContainer = styled.div`
  width: 10ch;
`;
