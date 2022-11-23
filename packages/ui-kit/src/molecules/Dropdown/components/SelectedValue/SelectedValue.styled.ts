import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  padding: 0 0 0 12px;
  min-width: 0;
  width: 100%;
`;

export const Placeholder = styled.div`
  &.primary {
    color: ${(props) => props.theme.text && rgba(props.theme.text, 0.5)};
    font-size: var(--font-size-s);
    text-transform: none;
    font-weight: 400;
  }

  &.secondary {
    color: ${(props) => props.theme.text && rgba(props.theme.text, 0.5)};
    font-size: var(--font-size-s);
    text-transform: none;
    font-weight: 400;
  }

  &.third {
    color: ${(props) => props.theme.text};
    font-size: var(--font-size-xxs);
    text-transform: uppercase;
    font-weight: 500;
  }
`;

export const Value = styled.div`
  color: ${(props) => props.theme.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.primary {
    font-size: var(--font-size-s);
    font-weight: 500;
  }

  &.secondary {
    font-size: var(--font-size-s);
    font-weight: 500;
  }

  &.third {
    font-size: var(--font-size-xxs);
    font-weight: 400;
  }
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
