import {rgba} from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SignInMethodsContainer = styled.div`
  padding-top: 22px;
  border-top: 2px solid ${(props) => props.theme.accentText};
  & > .title {
    display: block;
    margin: 0 10px 22px;
    font-family: Poppins;
    text-transform: uppercase;
    font-size: 15px;
    font-weight: 600;
    line-height: 22px;
    letter-spacing: 0.2em;
    text-align: left;
    color: ${(props) => props.theme.text};
  }

  & > .methods {
    display: flex;
    flex-wrap: wrap;
  }
`;

export const SignInMethodContainer = styled.button`
  width: 92px;
  height: 102px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px, 6px, 10px, 6px;
  margin: 0 14px 20px;

  background: ${(props) => props.theme.accentBg && rgba(props.theme.accentBg, 0.4)};
  border: 1px solid ${(props) => props.theme.accentText && rgba(props.theme.accentText, 0.6)};

  & > span {
    font-family: Poppins;
    font-size: 12px;
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
