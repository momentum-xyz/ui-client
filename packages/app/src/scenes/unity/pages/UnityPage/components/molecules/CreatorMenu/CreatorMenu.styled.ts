import {IconSvg} from '@momentum-xyz/ui-kit';
import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 50%;
  z-index: var(--dialog-z-index);

  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.8)};
  border-radius: 10px;
  padding: 5px 0;
  margin-left: 10px;
  align-items: center;
`;

export const MenuItem = styled.button`
  padding: 10px 10px;

  :disabled {
    opacity: 60%;
  }
`;

export const MenuText = styled(IconSvg)`
  :hover {
    color: ${(props) => props.theme.accent} !important;
  }
`;
