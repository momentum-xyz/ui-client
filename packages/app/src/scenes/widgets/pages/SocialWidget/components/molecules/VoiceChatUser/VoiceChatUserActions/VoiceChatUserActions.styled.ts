import {Text} from '@momentum-xyz/ui-kit';
import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  z-index: var(--dialog-z-index);
`;

export const Menu = styled.div`
  display: flex;
  align-items: center;
  width: 165px;
  height: 60px;
`;

export const Body = styled.div`
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.accent};
  color: ${(props) => props.theme.accent} !important;
  background: ${(props) => props.theme.bg && rgba(props.theme.bg, 0.75)};
`;

export const Action = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 7px;

  :hover {
    background: rgba(255, 255, 255, 10%);
  }
`;

export const ActionLabel = styled(Text)`
  color: ${(props) => props.theme.accent};
`;

export const Pointer = styled.div`
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;

  border-left: 14px solid ${(props) => props.theme.accent && rgba(props.theme.accent, 1)};
`;
