import styled from 'styled-components';
import {rgba} from 'polished';

export const ToastContainer = styled.div`
  padding: 10px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: flex-start;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.6)};
  gap: 10px;

  &.danger {
    background: ${(props) => props.theme.accentBg && rgba(props.theme.danger, 0.6)};
  }
`;

export const Content = styled.div``;

export const Message = styled.div`
  color: ${(props) => props.theme.text};
  font-size: var(--font-size-m);
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0.02em;
  text-align: left;
`;

export const Buttons = styled.div`
  padding: 10px 0 0 0;
  display: flex;
  justify-content: flex-start;
  gap: 10px;
`;

export const CloseButton = styled.div`
  svg {
    color: ${(props) => props.theme.accentText};
  }
`;
