import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div``;

export const WalletContainer = styled.div`
  padding: 0 0 10px 0;
  border-bottom: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
`;

export const Wallet = styled.div``;

export const WalletActions = styled.div`
  margin: 0 1px;
  padding: 10px 0;
  display: flex;
  gap: 10px;
`;

export const Title = styled.div`
  padding: 0 0 10px 0;
  font-weight: 600;
  font-size: var(--font-size-l);
  letter-spacing: 0.2em;
  text-transform: uppercase;
`;

export const ConnectContainer = styled.div`
  padding: 20px 0 0 0;
`;

export const ConnectWithWalletRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  & > img {
    height: 22px;
  }

  & > span {
    margin-left: 10px;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${(props) => props.theme.text};
  }
`;
