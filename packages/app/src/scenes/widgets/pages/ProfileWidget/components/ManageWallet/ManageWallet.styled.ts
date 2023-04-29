import styled from 'styled-components';
import {rgba} from 'polished';

export const Container = styled.div`
  --scroll-offset: 230px;
`;

export const GeneralScrollable = styled.div`
  height: calc(100vh - var(--scroll-offset));
  flex-direction: column;
  overflow: auto;
`;

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

export const Methods = styled.div`
  padding: 0 0 20px 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px 40px;
`;

export const MethodItem = styled.button`
  width: 100%;
  height: 102px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px, 6px, 10px, 6px;
  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
  border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
  transition: all var(--tr-150-ei);

  &:hover,
  &.active {
    background: ${(props) => props.theme.accentBg};
    border: 1px solid ${(props) => props.theme.accentText};
  }

  & > span {
    font-size: var(--font-size-xs);
    font-weight: 500;
    line-height: 18px;
    letter-spacing: 0.08em;
    text-align: center;
    color: ${(props) => props.theme.text};
  }

  & > img {
    max-width: 64px;
    height: 64px;
    margin-bottom: 4px;
  }
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
