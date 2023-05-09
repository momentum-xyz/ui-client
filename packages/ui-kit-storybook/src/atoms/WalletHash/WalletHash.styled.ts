import styled from 'styled-components';
import {rgba} from 'polished';

export const WalletContainer = styled.div`
  display: grid;
  padding: 8px 10px;
  grid-template-columns: 20px 1fr;
  align-items: center;
  border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.3)};
  color: ${(props) => props.theme.text};
  font-size: var(--font-size-m);
  border-radius: 4px;
  gap: 8px;

  &.noIcon {
    padding: 8px 12px;
    grid-template-columns: 1fr;
  }
`;

export const Wallet = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
