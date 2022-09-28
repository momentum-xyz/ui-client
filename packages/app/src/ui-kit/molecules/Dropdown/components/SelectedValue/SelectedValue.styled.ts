import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  padding: 0 0 0 12px;
  min-width: 0;
  width: 100%;
`;

export const Placeholder = styled.div`
  color: ${(props) => props.theme.text && rgba(props.theme.text, 0.5)};
  text-transform: none;
  font-weight: 400;
  font-size: var(--font-size-s);
`;

export const Value = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const WalletValue = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  align-items: center;
`;

export const WalletIcon = styled.div`
  display: grid;
  grid-template-columns: 14px 1fr;

  span:last-child {
    padding: 0 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const Wallet = styled.div`
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
