import styled from 'styled-components';

export const Container = styled.div`
  padding: 10px;
`;

export const TitleText = styled.div`
  margin-bottom: 22px;
  text-transform: uppercase;
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
  letter-spacing: 0.2em;
  text-align: left;
  color: ${(props) => props.theme.text};

  &.wallet {
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

export const WalletInnerViewContainer = styled.div`
  margin-bottom: 16px;
`;

export const InputContainer = styled.div`
  display: grid;
  grid-template-columns: 24px 1fr;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;
