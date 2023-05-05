import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  --scroll-offset: 270px;

  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Title = styled.div`
  padding: 10px 0 0 0;
  font-size: var(--font-size-l);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 600;
`;

export const Desc = styled.div`
  padding: 12px 0 12px 0;
  line-height: 22px;
`;

export const ScrollableContainer = styled.div`
  padding: 10px 0 0 0;
  border-top: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
  height: calc(100vh - var(--scroll-offset));
  overflow: auto;
`;

export const SignInMethodsContainer = styled.div``;

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

export const ConnectWithWallet = styled.div`
  & > button {
    margin-bottom: 16px;
  }
`;
