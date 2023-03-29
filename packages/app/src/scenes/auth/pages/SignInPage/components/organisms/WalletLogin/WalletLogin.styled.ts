import styled from 'styled-components';

export const Container = styled.div`
  padding: 10px;
`;

export const TitleText = styled.div`
  margin-bottom: 22px;
  font-family: Poppins;
  text-transform: uppercase;
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
  letter-spacing: 0.2em;
  text-align: left;
  color: #ffffff;

  &.wallet {
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

export const WalletInnerViewContainer = styled.div`
  margin-bottom: 16px;
`;
