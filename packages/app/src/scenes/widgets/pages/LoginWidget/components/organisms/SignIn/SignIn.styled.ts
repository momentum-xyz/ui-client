import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  --scroll-offset: 360px;

  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Title = styled.div`
  padding: 20px 0 0 0;
  font-size: var(--font-size-l);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 600;
`;

export const Desc = styled.div`
  padding: 12px 0 22px 0;
  line-height: 22px;
`;

export const ScrollableContainer = styled.div`
  border-top: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};
  height: calc(100vh - var(--scroll-offset));
  overflow: auto;
`;

export const SignInMethodsContainer = styled.div``;

export const Methods = styled.div`
  padding: 20px 1px 30px 1px;
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

export const ExtraInfoPoints = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  & > .row {
    display: flex;

    & > button {
      flex: 0 0 30px;
    }
    & > span {
      color: ${(props) => props.theme.text};
      margin-top: 5px;
      margin-left: 10px;
    }
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

export const ConnectWithWallet = styled.div`
  & > button {
    margin-bottom: 16px;
  }
`;
