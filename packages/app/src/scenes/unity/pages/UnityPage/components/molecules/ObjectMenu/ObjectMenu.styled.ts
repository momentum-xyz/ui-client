import {Text} from '@momentum-xyz/ui-kit';
import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  display: flex;

  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.8)};
  border-radius: 10px;
  padding: 5px 0;
`;

export const MenuItem = styled.button`
  padding: 10px 10px;
  :nth-child(3),
  :nth-child(5),
  :nth-child(7) {
    border-right: 1px solid ${(props) => props.theme.accent};
  }

  :disabled {
    opacity: 60%;
  }
`;

export const MenuText = styled(Text)`
  :hover {
    color: ${(props) => props.theme.accent} !important;
  }
`;
